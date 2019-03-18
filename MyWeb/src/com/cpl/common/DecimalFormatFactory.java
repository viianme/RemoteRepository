package com.cpl.common;

import java.lang.ref.WeakReference;
import java.text.DecimalFormat;
import java.util.Map;
import java.util.WeakHashMap;

/**
 * 建造DecimalFormat物件的工廠
 * 
 * @author Shan Lin
 * @version 1.0 106/09/22
 *
 */
public class DecimalFormatFactory {

	private static Map<DecimalFormat, WeakReference<DecimalFormat>> decimalFormat = new WeakHashMap<>();
	
	public static DecimalFormat createDecimalFormat(String pattern) {
		
		DecimalFormat sdf = new DecimalFormat(pattern);
		if(!decimalFormat.containsKey(sdf)) {
			decimalFormat.put(sdf, new WeakReference<DecimalFormat>(sdf));
		}
		return decimalFormat.get(sdf).get();
	}
	
	public static Map<DecimalFormat, WeakReference<DecimalFormat>> getDecimalFormatMap() {
		return decimalFormat;
	}
}
