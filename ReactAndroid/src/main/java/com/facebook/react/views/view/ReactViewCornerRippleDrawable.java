package com.facebook.react.views.view;

import android.annotation.TargetApi;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.RippleDrawable;
import android.os.Build;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

/**
 * Created by yinhf on 2017/9/7.
 * TODO oppo 下无效
 */
@TargetApi(Build.VERSION_CODES.LOLLIPOP)
public class ReactViewCornerRippleDrawable extends RippleDrawable {

  private float[] radii;

  public ReactViewCornerRippleDrawable(@NonNull ColorStateList color, @Nullable Drawable content) {
    super(color, content, createMask());
  }

  private static Drawable createMask() {
    GradientDrawable mask = new GradientDrawable();
    mask.setColor(Color.WHITE);
    return mask;
  }

  public void setCornerRadii(float topLeft, float topRight, float bottomRight, float bottomLeft) {
    if (radii == null) {
      radii = new float[8];
    }

    radii[0] = radii[1] = topLeft;
    radii[2] = radii[3] = topRight;
    radii[4] = radii[5] = bottomRight;
    radii[6] = radii[7] = bottomLeft;

    GradientDrawable mask = (GradientDrawable) findDrawableByLayerId(android.R.id.mask);
    mask.setCornerRadii(radii);
    // 由于setCornerRadii 不会触发 computeOpacity 所以需要调用setShape 用于触发 computeOpacity
    mask.setShape(GradientDrawable.RECTANGLE);
  }
}
