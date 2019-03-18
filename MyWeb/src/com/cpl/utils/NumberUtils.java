package com.cpl.utils;

import java.text.DecimalFormat;

import com.cpl.common.DecimalFormatFactory;

public class NumberUtils {

   /**
     *	Format字串成為數值　傳入值　要format的字串,小數點幾位
     *@param	d	double的數字內容
     *@param	l	要格式化的，小數點幾位數
     *@return		傳回格式化後的字串值
   */
   public static String formatNum(double d,int l) {
   	return formatNum(String.valueOf(d),l);
   }
   
  /**
    *	Format字串成為數值　傳入值　要format的字串,小數點幾位
    *@param	s	double的數字內容
    *@param	l	要格式化的，小數點幾位數
    *@return		傳回格式化後的字串值
  */
  public static String formatNum(String s,int l) {
  	int index = s.indexOf(".");
  	String style = "";
  	for(int i = 0;i<index;i++) {
  		style = style + "#";
  	}
  	if(l > 0) {
  		style = style + ".";
  		for(int i=0;i<l;i++) {
  			style = style + "#";
  		}
  	}
  	DecimalFormat df = DecimalFormatFactory.createDecimalFormat(style);
//  	DecimalFormat df = new DecimalFormat(style);
  	return df.format(Double.parseDouble(s));
  }
   
}
