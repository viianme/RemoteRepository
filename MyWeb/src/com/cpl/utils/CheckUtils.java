package com.cpl.utils;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CheckUtils {

	public static void main(String[] args) {
		Pattern pattern = Pattern.compile("[0-9]*");
		Matcher isNum = pattern.matcher("12a");
		System.out.println("isNum:"+isNum);
		System.out.println("isNum:"+isNum.matches());
	}
	
	/**
	 * 檢查傳入參數陣列 若為 "" or 空白 or null 回傳true
	 * 
	 * @param params
	 * @return
	 */
	public static boolean checkParamsEmpty(String... params){
		for(String param:params){
			if(StringUtils.isEmpty(param)){
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 檢查List物件 NUll or isEmpty
	 * 
	 * @param list
	 * @return
	 */
	public static boolean checkListNull(List<?> list){
		return list == null || list.isEmpty();
	}

	/**
	 * 檢查List物件 不為空 or NULL
	 * 
	 * @param list
	 * @return
	 */
	public static boolean checkListNotNull(List<?> list){
		return list!=null && !list.isEmpty();
	}
	
	/**
	 * 檢查Map物件 NUll or isEmpty
	 * 
	 * @param list
	 * @return
	 */
	public static boolean checkMapNull(Map<?,?> map){
		return map == null || map.isEmpty();
	}
	
	
	/**
	 * 檢查Map物件不為空 or NULL
	 * 
	 * @param list
	 * @return
	 */
	public static boolean checkMapNotNull(Map<?,?> map){
		return map != null || !map.isEmpty();
	}
	
	
	/**
	 * 檢查字串是否為數字
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNumber(String numStr){
		if(checkParamsEmpty(numStr)) return false;
		Pattern pattern = Pattern.compile("[0-9]*");
		Matcher isNum = pattern.matcher(numStr);
		if(!isNum.matches()){    //若輸入字串包含pattern中的字isNum.matches() return true
			return false;
		}
		
		return true;
	}
	
	
	
}
