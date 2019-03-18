package com.cpl.investment;

import com.cpl.utils.DateUtils;
import com.cpl.utils.NumberUtils;

public class Interest {

	public static void main(String[] args) {
		
		String result = Interest.calInterest(1, "1070812", "1080812", "1000000", "1.0");
		System.out.println(result);
		
		
		double r = 0.05;
		   int p = 1000;
		   int n = 10;
		   int m1,m2;
		   System.out.println("年　　A銀行(複利)　　B銀行(單利)");
		   System.out.println("----------------------------------------");
		   for(int i = 1; i <= n ; i++){
		      m1 = (int)(p * Math.pow( (1+r) , i ));
		      m2 = (int)(p * ( 1 + r*i ));
		      System.out.printf("%d\t%d\t\t%d\n",i,m1,m2);
		   }
		   System.out.println("----------------------------------------");
		   
	
	}
	
//	public static String accumulatedAmount(){
//		
//	}
	
	/**
	*輸入利息型態，起始終止日，本金及利率，回傳利息
	@param      type 1表年利，2表月利
	@param		date_start 起始七碼民國日
	@param		date_end   終止七碼民國日
	@praam      money 本金
	@param      rate 利率 % 如:5%
	@return		回傳利息
	 */ 
	public static String calInterest(int type,String date_start,String date_end,String money,String rate){
		double interest=0;
   		try{
 			if (date_start.trim().length()==7 && date_end.trim().length()==7){
 				double days  =(double) DateUtils.getCDateDiff(date_start, date_end);
	  			double moneys=Double.parseDouble(money);
	  			double rates =Double.parseDouble(rate);
	 			switch(type){
	    			case 1: interest=days*moneys*(rates/(365*100)); break;
	    			case 2: interest=days*moneys*(rates/(30*100)); break;
	 			}
 			}
  		}
  		catch (Exception ex){
			System.out.println("interest="+ex);   
 	 	}
  		String str=String.valueOf(interest);
  		String cstr=NumberUtils.formatNum(str,2);
  		return cstr;
	}

}
