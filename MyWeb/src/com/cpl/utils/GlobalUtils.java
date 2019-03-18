package com.cpl.utils;

import java.io.File;

public class GlobalUtils {

	public static void main (String [] args){
//		System.out.println("os:"+checkOS());
	}

	public static String checkOS(){
		return (File.separator).equals("\\")?"win":"linux";
	}
	
	
}
