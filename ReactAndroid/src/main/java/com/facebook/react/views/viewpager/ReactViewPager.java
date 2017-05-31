/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.facebook.react.views.viewpager;

import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewCompat;
import android.support.v4.view.ViewPager;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.NativeGestureUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * Wrapper view for {@link ViewPager}. It's forwarding calls to {@link ViewGroup#addView} to add
 * views to custom {@link PagerAdapter} instance which is used by {@link NativeViewHierarchyManager}
 * to add children nodes according to react views hierarchy.
 */
public class ReactViewPager extends ViewPager {

  private class Adapter extends PagerAdapter {

    private final List<View> mViews = new ArrayList<>();
    private boolean mIsViewPagerInIntentionallyInconsistentState = false;

    void addView(View child, int index) {
      mViews.add(index, child);
      notifyDataSetChanged();
      // This will prevent view pager from detaching views for pages that are not currently selected
      // We need to do that since {@link ViewPager} relies on layout passes to position those views
      // in a right way (also thanks to {@link ReactViewPagerManager#needsCustomLayoutForChildren}
      // returning {@code true}). Currently we only call {@link View#measure} and
      // {@link View#layout} after yoga step.

      // TODO(7323049): Remove this workaround once we figure out a way to re-layout some views on
      // request
      setOffscreenPageLimit(mViews.size());
    }

    void removeViewAt(int index) {
      mViews.remove(index);
      notifyDataSetChanged();

      // TODO(7323049): Remove this workaround once we figure out a way to re-layout some views on
      // request
      setOffscreenPageLimit(mViews.size());
    }

    /**
     * Replace a set of views to the ViewPager adapter and update the ViewPager
     */
    void setViews(List<View> views) {
      mViews.clear();
      mViews.addAll(views);
      notifyDataSetChanged();

      // we want to make sure we return POSITION_NONE for every view here, since this is only
      // called after a removeAllViewsFromAdapter
      mIsViewPagerInIntentionallyInconsistentState = false;
    }

    /**
     * Remove all the views from the adapter and de-parents them from the ViewPager
     * After calling this, it is expected that notifyDataSetChanged should be called soon
     * afterwards.
     */
    void removeAllViewsFromAdapter(ViewPager pager) {
      mViews.clear();
      pager.removeAllViews();
      // set this, so that when the next addViews is called, we return POSITION_NONE for every
      // entry so we can remove whichever views we need to and add the ones that we need to.
      mIsViewPagerInIntentionallyInconsistentState = true;
    }

    View getViewAt(int index) {
      return mViews.get(index);
    }

    @Override
    public int getCount() {
      return mViews.size();
    }

    @Override
    public int getItemPosition(Object object) {
      // if we've removed all views, we want to return POSITION_NONE intentionally
      return mIsViewPagerInIntentionallyInconsistentState || !mViews.contains(object) ?
        POSITION_NONE : mViews.indexOf(object);
    }

    @Override
    public Object instantiateItem(ViewGroup container, int position) {
      View view = mViews.get(position);
      container.addView(view, 0, generateDefaultLayoutParams());
      return view;
    }

    @Override
    public void destroyItem(ViewGroup container, int position, Object object) {
      container.removeView((View) object);
    }

    @Override
    public boolean isViewFromObject(View view, Object object) {
      return view == object;
    }
  }

  private class PageChangeListener implements OnPageChangeListener {

    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
      mEventDispatcher.dispatchEvent(
          new PageScrollEvent(getId(), position, positionOffset));
    }

    @Override
    public void onPageSelected(int position) {
      if (!mIsCurrentItemFromJs) {
        mEventDispatcher.dispatchEvent(
            new PageSelectedEvent(getId(), position));
      }
    }

    @Override
    public void onPageScrollStateChanged(int state) {
      String pageScrollState;
      switch (state) {
        case SCROLL_STATE_IDLE:
          pageScrollState = "idle";
          break;
        case SCROLL_STATE_DRAGGING:
          pageScrollState = "dragging";
          break;
        case SCROLL_STATE_SETTLING:
          pageScrollState = "settling";
          break;
        default:
          throw new IllegalStateException("Unsupported pageScrollState");
      }
      // LAB modify 增加发送当前position
      mEventDispatcher.dispatchEvent(
        new PageScrollStateChangedEvent(getId(), pageScrollState, getCurrentItem()));
    }
  }

  private final EventDispatcher mEventDispatcher;
  private boolean mIsCurrentItemFromJs;
  private boolean mScrollEnabled = true;

  public ReactViewPager(ReactContext reactContext) {
    super(reactContext);
    mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
    mIsCurrentItemFromJs = false;
    setOnPageChangeListener(new PageChangeListener());
    setAdapter(new Adapter());
  }

  @Override
  public Adapter getAdapter() {
    return (Adapter) super.getAdapter();
  }

  @Override
  public boolean onInterceptTouchEvent(MotionEvent ev) {
    if (!mScrollEnabled) {
      return false;
    }

    if (super.onInterceptTouchEvent(ev)) {
      NativeGestureUtil.notifyNativeGestureStarted(this, ev);
      return true;
    }
    return false;
  }

  @Override
  public boolean onTouchEvent(MotionEvent ev) {
    if (!mScrollEnabled) {
      return false;
    }

    return super.onTouchEvent(ev);
  }

  public void setCurrentItemFromJs(int item, boolean animated) {
    mIsCurrentItemFromJs = true;
    setCurrentItem(item, animated);
    mIsCurrentItemFromJs = false;
  }

  public void setScrollEnabled(boolean scrollEnabled) {
    mScrollEnabled = scrollEnabled;
  }

  /*package*/ void addViewToAdapter(View child, int index) {
    getAdapter().addView(child, index);
  }

  /*package*/ void removeViewFromAdapter(int index) {
    getAdapter().removeViewAt(index);
  }

  /*package*/ int getViewCountInAdapter() {
    return getAdapter().getCount();
  }

  /*package*/ View getViewFromAdapter(int index) {
    return getAdapter().getViewAt(index);
  }

  public void setViews(List<View> views) {
    getAdapter().setViews(views);
  }

  public void removeAllViewsFromAdapter() {
    getAdapter().removeAllViewsFromAdapter(this);
  }

  // LAB modify 修复ViewPager 在removeClippedSubviews中无法populate的bug
  // 修复重新onAttachedToWindow 之后无法滚动的bug
  private boolean isLayoutPosted;
  private boolean isFirstAttach = true;

  private final Runnable mLayoutRunnable = new Runnable() {
    @Override
    public void run() {
    isLayoutPosted = false;
    measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
    layout(getLeft(), getTop(), getRight(), getBottom());
    }
  };

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    isLayoutPosted = false;

    if (!isFirstAttach || (getMeasuredWidth() > 0 && getMeasuredHeight() > 0 && getAdapter().getCount() > 0 && getChildCount() == 0)) {
      // 1.removeClippedSubviews恢复时 onAttachedToWindow不会触发measure layout 所以对于不是第一次attach 需要强制调用measure layout
      // 2.已经measure过了 且adapter不为空 且当前没有子View，说明上一次measure时未attached(在父view为removeClippedSubviews时会发生)
      forceLayout();
      measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
        MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
      layout(getLeft(), getTop(), getRight(), getBottom());
    }
    isFirstAttach = false;
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    isLayoutPosted = false;
  }

  @Override
  public void requestLayout() {
    super.requestLayout();
    if (!isLayoutPosted && ViewCompat.isAttachedToWindow(this)) {
      isLayoutPosted = true;
      post(mLayoutRunnable);
    }
  }

}
