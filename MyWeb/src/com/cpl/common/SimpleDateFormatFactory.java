package com.cpl.common;

import java.lang.ref.WeakReference;
import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.Map;
import java.util.WeakHashMap;

/**
 * 建造SimpleDateFormat物件的工廠
 * @author 
 * @version 1.0 
 *
 */
public class SimpleDateFormatFactory {
	private static Map<SimpleDateFormat, WeakReference<SimpleDateFormat>> simpleDateFormat = new WeakHashMap<>();
	
	public static SimpleDateFormat createSimpleDateFormat(String pattern) {
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		if(!simpleDateFormat.containsKey(sdf)) {
			simpleDateFormat.put(sdf, new WeakReference<SimpleDateFormat>(sdf));
		}
		return simpleDateFormat.get(sdf).get();
	}
	
	public static SimpleDateFormat createSimpleDateFormat(String pattern, Locale locale) {
		SimpleDateFormat sdf = new SimpleDateFormat(pattern, locale);
		if(!simpleDateFormat.containsKey(sdf)) {
			simpleDateFormat.put(sdf, new WeakReference<SimpleDateFormat>(sdf));
		}
		return simpleDateFormat.get(sdf).get();
	}
	
	public static Map<SimpleDateFormat, WeakReference<SimpleDateFormat>> getSimpleDateFormatMap() {
		return simpleDateFormat;
	}
}
