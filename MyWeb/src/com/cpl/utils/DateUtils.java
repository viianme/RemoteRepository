package com.cpl.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Vector;

import com.cpl.common.SimpleDateFormatFactory;
import com.cpl.exception.MyException;

/**
 * 共用日期工具
 * 
 * @author 
 * @version 1.0 106/07/20
 */
public class DateUtils {
	
	private static Calendar calendar = Calendar.getInstance();
	
	public enum DATE_SEPARATOR{
		CHINESE, SLASHES, DASHES, EMPTY, CUSTOM
	}
	
	public enum TYPE{
		YEAR, MONTH, DATE
	}

	/**
	 * 將當前日期轉換為民國格式 : 1060801
	 * @return yyyMMdd 民國格式字串
	 */
	public static String getNowCDate(){
		return getFormatCDate(new Date(), DATE_SEPARATOR.EMPTY);
	}
	
	/**
	 * 將日期轉換為民國格式 : 1060801
	 * @param date
	 * @return
	 */
	public static String getCDate(Date date){
		return getFormatCDate(date, DATE_SEPARATOR.EMPTY);
	}
	
	/**
	*將輸入日期Calendar轉為七碼中文日期
	*@param		calendar Caledar
	*@retur     七碼中文日期yyymmdd
    */  
   	public static String getCDate(Calendar calendar){
   		return getFormatCDate(calendar, DATE_SEPARATOR.EMPTY);
   	}
	
	/**
	 * 將當前日期轉換為民國格式 : 106/08/01
	 * @return yyy/MM/dd 民國格式字串
	 */
	public static String getFormatNowCDate(){
		return getFormatCDate(new Date());
	}
	
	/**
	 * 將當前日期轉換為民國格式 : 
	 * @param  separator  CHINESE, SLASHES, DASHES, EMPTY
	 * @return 依separator轉換為民國格式字串
	 */
	public static String getFormatNowCDate(DATE_SEPARATOR separator){
		return getFormatCDate(new Date(),separator);
	}
	
	public static String getFormatNowDate(){
		return getFormatDate(new Date());
	}
	
	public static String getFormatNowDate(DATE_SEPARATOR separator){
		return getFormatDate(new Date(),separator);
	}
	
	/**
	 * 將日期物件轉成預設格式的字串 預設格式 : yyyy/MM/dd
	 * @param date
	 * @return
	 */
	public static String getFormatCDate(Date date) {
		return getFormatCDate(date, DATE_SEPARATOR.SLASHES);
	}
	
	/**
	 * 傳入民國年月日 7碼日期
	 * 預設轉成格式 yyy/MM/dd字串
	 * Example: 1060720 -> 106/07/20
	 * 
	 * @param dateStr 民國年月日
	 * @return
	 */
	public static String getFormatCDate(String dateStr) {
		return getFormatCDate(dateStr, DATE_SEPARATOR.SLASHES);
	}
	
	/**
	 * 傳入民國年月日 7碼日期
	 * 轉成格式  年 + 自訂分隔符號  + 月  + 自訂分隔符號 + 日
	 * Example: formatCDate("1060720", "-") -> return 106-07-20
	 * 
	 * @param dateStr 民國年月日
	 * @param separated 年月日分隔符號
	 * @return
	 */
	public static String getFormatCDate(String dateStr, DATE_SEPARATOR separator) {
		if(StringUtils.isEmpty(dateStr)) {
			return "";
		} else if(dateStr.length() < 7) {
			return dateStr;
		}
		String year = dateStr.substring(0, 3);
		String month= dateStr.substring(3, 5);
		String day  = dateStr.substring(5);
		return dateFormater(year, month, day, separator);
	}
	
	public static String getFormatDate(Date date) {
		return getFormatDate(date, DATE_SEPARATOR.SLASHES);
	}
	
	public static String getFormatCDate(Date date, DATE_SEPARATOR separator){
		return dateFormater(getCYear(date), getMonth(date), getDate(date), separator);
	}
	
	public static String getFormatCDate(Calendar calendar, DATE_SEPARATOR separator){
		return dateFormater(getCYear(calendar), getMonth(calendar), getDate(calendar), separator);
	}
	
	public static String getFormatDate(Date date, DATE_SEPARATOR separator){
		return dateFormater(getYear(date), getMonth(date), getDate(date), separator);
	}
	
	public static String dateFormater(String year,String month,String day,DATE_SEPARATOR separator){
		switch(separator){
		case DASHES:
			return String.format("%s-%s-%s", fillCYearZero(year),fillMonthZero(month),fillDateZero(day));
		case CHINESE:
			return String.format("%s年%s月%s日", fillCYearZero(year), fillMonthZero(month), fillDateZero(day));
		case SLASHES:
			return String.format("%s/%s/%s", fillCYearZero(year), fillMonthZero(month), fillDateZero(day));
		default :
			return String.format("%s%s%s", fillCYearZero(year), fillMonthZero(month), fillDateZero(day));
			
		}
	}
	/**
	 * 取得當前日期西元年
	 * 
	 * @return
	 */
	public static String getYear(){
		return getYear(new Date());
	}
	/**
	 * 取得當前日期民國年
	 * 
	 * @return
	 */
	public static String getCYear() {
		return getCYear(new Date());
	}
	/**
	 * 取得當前日期月份
	 * 
	 * @return
	 */
	public static String getMonth() {
		return getMonth(new Date());
	}
	/**
	 * 取得當前日期日期
	 * 
	 * @return
	 */
	public static String getDate() {
		return getDate(new Date());
	}
	
	public static String getYear(Date date){
		calendar.setTime(date);
		return String.valueOf(calendar.get(Calendar.YEAR));
	}
	
	public static String getCYear(Date date){
		calendar.setTime(date);
		return String.valueOf(calendar.get(Calendar.YEAR) - 1911);
	}
	
	public static String getMonth(Date date){
		calendar.setTime(date);
		return String.valueOf(calendar.get(Calendar.MONTH) + 1);
	}
	
	public static String getDate(Date date){
		calendar.setTime(date);
		return String.valueOf(calendar.get(Calendar.DATE));
	}
	
	public static String getCYear(Calendar calendar){
		return String.valueOf(calendar.get(Calendar.YEAR) - 1911);
	}
	
	public static String getMonth(Calendar calendar){
		return String.valueOf(calendar.get(Calendar.MONTH) + 1);
	}
	
	public static String getDate(Calendar calendar){
		return String.valueOf(calendar.get(Calendar.DATE));
	}
	
	/**
	 * 民國年不足三碼補0
	 * 
	 * @param year
	 * @return
	 */
	public static String fillCYearZero(String year){
		return StringUtils.leftPad(year, 3, "0");
	}
	
	/**
	 * 月份不足兩碼補0
	 * 
	 * @param month
	 * @return
	 */
	public static String fillMonthZero(String month) {
		return StringUtils.leftPad(month, 2, "0");
	}

	/**
	 * 日期不足兩碼補0
	 * 
	 * @param day
	 * @return
	 */
	public static String fillDateZero(String day) {
		return StringUtils.leftPad(day, 2, "0");
	}
	
	/**
	 * 將當前日期轉換為時間格式 : 18:05 -> 1805
	 * @param date
	 * @return
	 */
	public static String toHHMM(){
		return toHHMM(new Date());
	}
	
	/**
	 * 將日期轉換為時間格式 : 18:05 -> 1805
	 * @param date
	 * @return
	 */
	
	public static String toHHMM(Date date){
		SimpleDateFormat HHmm = SimpleDateFormatFactory.createSimpleDateFormat("HHmm");
		return HHmm.format(date);
	}
	
	/**
	 * 將當前日期轉換為時間格式 : 18:05:01 -> 180501
	 * @param date
	 * @return
	 */
	public static String toHHMMSS() {
		return toHHMMSS(new Date());
	}
	
	/**
	 * 將日期轉換為時間格式 : 18:05:01 -> 180501
	 * @param date
	 * @return
	 */
	public static String toHHMMSS(Date date) {
		SimpleDateFormat HHmmss = SimpleDateFormatFactory.createSimpleDateFormat("HHmmss");
		return HHmmss.format(date);
	}
	
	public static void validateCDateThrowException(String...dates){
		for(String date : dates) {
			if (StringUtils.isEmpty(date) || date.length() < 7 || !CheckUtils.isNumber(date)) {
				throw new MyException("日期格式有誤 : " + date);
			}
		}
	}
	
	public static String toYYYMMDDHHMMSS(Date date) {
		return String.format("%s%s", DateUtils.getCDate(date), DateUtils.toHHMMSS(date));
	}
	
	/**
	 * 比較兩民國日期相差天數
	 * 
	 * @param date1 格式 yyyMMdd
	 * @param date2 格式 yyyMMdd
	 * @return
	 */
	public static int getCDateDiff(String date1, String date2){
		validateCDateThrowException(date1,date2);
		Date dateS = getDateByCDateStr(date1);
		Date dateE = getDateByCDateStr(date2);
		long days = dateS.getTime() - dateE.getTime();
		return (int) Math.abs(days / 1000 / 60 / 60 / 24);
	}
	
	/**
	 * 比較兩民國日期相差天數，若發生錯誤則回傳預設值
	 * 
	 * @param date1
	 * @param date2
	 * @param def
	 * @return
	 */
	public static int getCdateDiffByDay(String date1, String date2, int def) {
		try {
			validateCDateThrowException(date1, date2);
		} catch(RuntimeException e) {
			return def;
		}
		Date dateS = getDateByCDateStr(date1);
		Date dateE = getDateByCDateStr(date2);
		long days = dateS.getTime() - dateE.getTime();
		return (int) Math.abs(days / 1000 / 60 / 60 / 24);
	}
	
	/**
	 * 計算兩個日期字串的差距，以日差計算。
	 * 
	 * @param Start_i
	 *            起始的日期字串
	 * @param End_i
	 *            結束的日期字串
	 * @return 傳回起始與結束兩日期的差距
	 */
	public static String compareDate(String date_s, String date_e) {
		return compareDate(date_s, date_e, 0);
	}
	
	/**
	 * 計算兩個日期字串的差距以日差計算
	 * 
	 * @param Start_i
	 *            起始的日期字串
	 * @param End_i
	 *            結束的日期字串
	 * @param l
	 *            小數點幾位數
	 * @return 傳回起始與結束兩日期的差距
	 */
	public static String compareDate(String Start_i, String End_i, int l) {
		return compareDate(Start_i, End_i, 3, l);
	}
	
	/**
	 * 計算兩個日期字串的差距
	 * 
	 * @param Start_i
	 *            起始的日期字串
	 * @param End_i
	 *            結束的日期字串
	 * @param flag
	 *            0:秒差，1:分差，2:時差，3:日差，4:月差(標準日數30)，5:年差
	 * @param l
	 *            小數點幾位數
	 * @return 傳回起始與結束兩日期的差距
	 */
	public static String compareDate(String Start_i, String End_i, int flag, int l) {
		String result_0 = "";
		long[] mills = { 0, 0, 0 };
		double diff = 0;
		Calendar cal1 = getCalendarByCDateStr(Start_i);
		Calendar cal2 = getCalendarByCDateStr(End_i);
		mills[0] = cal1.getTime().getTime();
		mills[1] = cal2.getTime().getTime();
		mills[2] = (mills[0] - mills[1]);
		diff = mills[2];
		if (flag >= 0)
			diff = diff / 1000;
		if (flag >= 1)
			diff = diff / 60;
		if (flag >= 2)
			diff = diff / 60;
		if (flag >= 3)
			diff = diff / 24;
		if (flag >= 4)
			diff = diff / 30;
		if (flag >= 5)
			diff = diff / 12;
		result_0 = NumberUtils.formatNum(diff, l);
		return result_0;
	}
	
	public static Calendar getCalendarByCDateStr(String dateStr){
		validateCDateThrowException(dateStr);
		Calendar calendar = Calendar.getInstance();
		int year  = Integer.parseInt(dateStr.substring(0,3))+1911;
		int month = Integer.parseInt(dateStr.substring(3,5))-1;
		int day   = Integer.parseInt(dateStr.substring(5));
		calendar.set(year, month, day);
		return calendar;
	}
	
	public static Date getDateByCDateStr(String dateStr) {
		return getCalendarByCDateStr(dateStr).getTime();
	}
	
	/**
	 * 取該日期該月份最後一天
	 * 
	 * @param dateStr
	 * @return
	 */
	public static Date getLastMonthDay(String dateStr) {
		validateCDateThrowException(dateStr);
		Date date = getDateByCDateStr(dateStr);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DATE));
		return calendar.getTime();
	}
	
	/**
	 * 取該日期該月份最後一天
	 * 
	 * @param year
	 * @param month
	 * @return
	*/
	public static String getLastMonthDay(int year,int month){
		String days="";
		if (month==0 || month==2 || month==4 || month==6 || month==7 || month==9 || month==11)
			days="31";
		if (month==3 || month==5 || month==8 || month==10)
			days="30";
		if (month==2){
			if ((year % 4)==0){
				if ((year % 100)==0){
					if ((year % 400)==0)
						days="29";
					else
						days="28";
				}
				else
					days="29";
			}
			else
				days="28";
		}
		return days;
	}
	
	/**
	 * 取該日期該月份最後一天
	 * 
	 * @param date
	 * @return
	 */
	public static Date getLastMonthDay(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DATE));
		return calendar.getTime();
	}
	
	public static Date getPreMonthLastDate(String dateStr) {
		validateCDateThrowException(dateStr);
		Date date = getDateByCDateStr(dateStr);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DATE));
		calendar.add(Calendar.MONTH, -1);
		return calendar.getTime();
	}
	
	

	
	/**
	*日期加減，分年月日三種
	@param		date1 七碼中文日期 
	@param		t 為 y 年,m 月,d 日
	@param		n 加減數字
	@return		回傳七碼中文日期yyymmdd
*/
    public static String datePlus(String date1,TYPE type,String n){
		String str="";
       	try{
       		int num=Integer.parseInt(n);
       		if (date1.trim().length()==7){
//       		Calendar d=al.dateType(date1);      
       			Calendar d=getCalendarByCDateStr(date1);
	  			switch (type){
	     			case YEAR : d.add(Calendar.YEAR,num);break;
	     			case MONTH: d.add(Calendar.MONTH,num);break;
	     			case DATE : d.add(Calendar.DATE,num);break;	
	  			}
	  			str=getCDate(d);
       		}
   		}
       	catch(Exception ex){
          	System.out.println("datePlus="+ex);
       	}
       	return str;
    }
		
	/**
	* 看两个日期是否有交集
	* A时间段,B时间段
	* 时间格式:yyyy-MM-dd
	*/
	private static boolean isOverlap(String startA, String endA, String startB, String endB) throws Exception{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		Date a1 = sdf.parse(startA), a2 = sdf.parse(endA);
		Date b1 = sdf.parse(startB), b2 = sdf.parse(endB);
		if ((a2.getTime() <= b1.getTime()) || a1.getTime() >= b2.getTime()){ //第一组最后时间小于等于第二组最前时间 || 第一组最前时间大于等于第二组最后时间
			return false;  // 无交集
		}
		else{
			return true;   //有交集
		}
	}
	
	//取得兩段日期區間重疊的天數
	public static int getDayCoincidence(String startA,String endA,String startB,String endB) throws ParseException{
		Date begindate1 = getDateByCDateStr(startA), enddate1 = getDateByCDateStr(endA);
		Date begindate2 = getDateByCDateStr(startB), enddate2 = getDateByCDateStr(endB);
		long b1=begindate1.getTime(), e1=enddate1.getTime();
		long b2=begindate2.getTime(), e2=enddate2.getTime();
		assert(b1<e1&&b2<e2);
		int coincidenceday=0;
		if(b1<=b2&&e1>=e2){          
			System.out.print("（startA---【startB-----endB】--endA）");                   
			coincidenceday=getCDateDiff(endB,startB);
		}else if(b1>=b2&&e1<=e2){
			System.out.print("（startB---【startA-----endA】--endB）");                     
			coincidenceday=getCDateDiff(endA,startA);
		}else if(b1>=b2&&b1<=e2&&e2<=e1){
			System.out.print("【startB---(startA-----endB】--endA）");   
			coincidenceday=getCDateDiff(endB,startA);
		}else if(b1<=b2&&e1<=e2&&e1>=b2){
			System.out.print("（startA---【startB-----endA）--endB】");                 
			coincidenceday=getCDateDiff(endA,startB);
		}else if(e1<=b2||b1>=e2){
			coincidenceday=0;
		}else{
			coincidenceday=-1;
			System.out.println("意料外的日期组合，無法计算重疊天数！");
		}
		System.out.println("重疊天數:["+coincidenceday+"]天。");
		return coincidenceday;
	}
	
	
	//此處DateUtils.compare為日期比較(返回負數date1小、返回0兩數相等、返回正整數date1大)  
	public static int compare(String date1, String date2){
		long dt1 = getDateByCDateStr(date1).getTime(), dt2 = getDateByCDateStr(date2).getTime();
		if(dt1>dt2){
			return 1;
		}else if(dt1<dt2){
			return -1;
		}else{
			return 0;
		}
	}
	
	//取得日期區間所有重疊的區間
	public static Set<Interval> getOverlap(List<Interval> intervalList) {
	    if (intervalList == null) {
	        throw new NullPointerException("Input list cannot be null.");
	    }

	    final HashSet<Interval> hashSet = new HashSet<Interval>();
	    for (int i = 0; i < intervalList.size() - 1; i++) {
	        final Interval intervali =  intervalList.get(i);
	        for (int j = 0; j < intervalList.size(); j++) {
	           final Interval intervalj = intervalList.get(j);
	           int js = Integer.parseInt(intervalj.getStart());
	           int je = Integer.parseInt(intervalj.getEnd());
	           int is = Integer.parseInt(intervali.getStart());
	           int ie = Integer.parseInt(intervali.getEnd());
	           if (js < ie && je > is && i != j) {
	        	   hashSet.add(new Interval(Math.max(is,js), Math.min(ie, je)));
	           }
	        }
	    }
	    return hashSet;
	}
	
	
	public static void main(String[] args) throws Exception {
				
//		List<Interval> intervalList = new ArrayList<Interval>();
//		//1.取收案日及辦案期限
//		String crmdt = "1040201";
//		String dly = "48";
//		//2.收案日+辦案期限=最初到期日 1080201
////		String N1 = datePlus("1040201",'m',"48");
//		String N1 = datePlus(crmdt,TYPE.MONTH,dly);
//		System.out.println("收案日["+crmdt+"] + 辦案期限["+dly+"]個月 = 最初到期日N1["+N1+"]");
//		//3.取所有起訖日在到期日N1前的C71區間 vr:[1050101, 1061231, 1061130, 1070221, 1070101, 1070402]
//		Vector vr = new Vector();
//		vr.addElement("1050101");vr.addElement("1061231");
//		vr.addElement("1061130");vr.addElement("1070221");
//		vr.addElement("1070101");vr.addElement("1070402");
//		System.out.println("取所有起訖日在到期日N1前的C71區間 vr:"+vr);
//		
//		if(vr.size()>0){
//			//4-1.累加所有日期區間得到新的N1後扣除重疊的天數
//			for(int i=0; i<vr.size()/2;i++){
//				String oriN1 = N1;
//				String s_C71 = (String)vr.elementAt(i*2);
//				String e_C71 = (String)vr.elementAt(i*2+1);
//				int diff = getCDateDiff(s_C71,e_C71);
//				N1 = datePlus(N1,TYPE.DATE,String.valueOf(diff));
//				System.out.println("原本N1["+oriN1+"] + ["+s_C71+"]~{"+e_C71+"]天數 :["+diff+"]  = 新N1["+N1+"]");
//				
//				//將所有C71區間放入list
//				intervalList.add(new Interval(s_C71,e_C71));
//			}
//			//4-2.新的N1扣除有重疊的天數
//			Set<Interval> resultSet = getOverlap(intervalList);//取得所有重疊的天數
//			int days=0;
//			if(resultSet.size()>0){
//				System.out.println("有重疊的區間:");
//				for(Interval inter: resultSet){
//					days += getCDateDiff(inter.getStart(),inter.getEnd());
//					System.out.println(inter.getDateInterval());
//				}
//			}
//			N1 = datePlus(N1,TYPE.DATE,String.valueOf(-days));
//			System.out.println("累加所有C71後的到期日扣除重疊["+days+"]天=新N1["+N1+"]");
//			
//		}
//		System.out.println("isOverlap():"+isOverlap("1050101","1060101","1051231","1060501"));		
//		System.out.println("getNowCDate():"+getNowCDate());
//		System.out.println("getCDate(new Date()):"+getCDate(new Date()));
//		System.out.println("getFormatNowDate():"+getFormatNowDate());
//		System.out.println("getFormatCDate('1060101'):"+getFormatCDate("1060101"));
//		System.out.println("getFormatCDate(new Date()):"+getFormatCDate(new Date()));
//		System.out.println("getFormatCDate(new Date(), DATE_SEPARATOR.DASHES):"+getFormatCDate(new Date(), DATE_SEPARATOR.DASHES));
//		System.out.println("getFormatNowCDate(DATE_SEPARATOR.CHINESE):"+getFormatNowCDate(DATE_SEPARATOR.CHINESE));
//		System.out.println("toHHMM():"+toHHMM());
//		System.out.println("DateUtils.getYear():"+DateUtils.getYear());
//		System.out.println("datePlus():"+datePlus("1060502", TYPE.MONTH, "-2"));
//		System.out.println("getCDateDiff():"+getCDateDiff("1060315", "1060502"));
		
		//1.會有一個要判斷的遲延日N_temp 最終遲延日N1 及intervalList(所有C71的list)
		String crmdt = "1050101";
		String dly = "16";
		String N1 = datePlus(crmdt, TYPE.MONTH, dly);
		System.out.println("收案日{"+crmdt+"} + 辦案期限{"+dly+"}個月 = 最初遲延日{"+N1+"}");
		
		List<Interval> intervalList = new ArrayList<Interval>();
		intervalList.add(new Interval("1060215","1060315"));
		
		String N_tmp=N1;
		for(Interval i : intervalList){
			N_tmp=N1;
			int c71Days = getCDateDiff(i.getStart(),i.getEnd());
			N1 = datePlus(N_tmp,TYPE.DATE,String.valueOf(c71Days)); //最後遲延日是 參數帶進來的，這邊測試先自己計算
			System.out.println("最初遲延日{"+N_tmp+"} + 視為不遲延區間C71{"+i.getStart()+"}-{"+i.getEnd()+"} {"+c71Days+"}天 = 最終遲延日{"+N1+"}");
		}
		
		N1 = getExcludeOverlapEnddt(N1,intervalList);
		System.out.println("N1:"+N1);
		System.out.println("N_tmp:"+N_tmp);
		String real_N1 = getRealDelayDate(N_tmp, N1, intervalList);
		System.out.println("real_N1:"+real_N1);
		
		/*
		//1.會有一個要判斷的遲延日N_temp 最終遲延日N1 及intervalList(所有C71的list)
		String crmdt = "1050101";
		String dly = "16";
		String N_temp = datePlus(crmdt, TYPE.MONTH, dly);
		System.out.println("收案日{"+crmdt+"} + 辦案期限{"+dly+"}個月 = 最初遲延日{"+N_temp+"}");
		
		List<Interval> intervalList = new ArrayList<Interval>();
		intervalList.add(new Interval("1060215","1060315"));
//		intervalList.add(new Interval("1060311","1060411"));
		
		
	
		//2.要判斷最後一筆C71消滅所餘辦案期限是否不足2個月
        //2-1.[取遲延日-2個月日期]
		String minusTwoMonDate = datePlus(N_temp, TYPE.MONTH, "-2");
		System.out.println("2-1.取遲延日減2個月的日期:{"+minusTwoMonDate+"}");
		//2-2.取所有C71中最後一筆C71迄日
		int size = intervalList.size();//有幾筆C71
		String lastC71enddt = intervalList.get(size-1).getEnd();//取最後一筆C71迄日
		String lastC71sddt  = intervalList.get(size-1).getStart();//取最後一筆C71迄日
		
		int c71Days = getCDateDiff(lastC71sddt,lastC71enddt);
		String N1 = datePlus(N_temp,TYPE.DATE,String.valueOf(c71Days)); //最後遲延日是 參數帶進來的，這邊測試先自己計算
		System.out.println("最初遲延日{"+N_temp+"} + 視為不遲延區間C71{"+lastC71sddt+"}-{"+lastC71enddt+"} {"+c71Days+"}天 = 最終遲延日{"+N1+"}");
		
		System.out.println("2-2.共有{"+size+"}筆C71。取所有C71中最後一筆C71迄日:{"+lastC71enddt+"}");
		//2-3.判斷最後一筆C71消滅所餘辦案期限是否不足2個月
		if(compare(minusTwoMonDate,lastC71enddt)==-1){
			int remain = getCDateDiff(lastC71enddt, N_temp);
			System.out.println("最後一筆C71消滅所餘辦案期限不足2個月，取得C71迄日至遲延日剩餘天數{"+remain+"}");
			String real_N1 = datePlus(N1,TYPE.DATE,String.valueOf(remain));
			System.out.println("最終遲延日{"+N1+"}要補足不足2個月的剩餘天數{"+remain+"} = :{"+real_N1+"}");
		}
		*/
		//(返回負數date1小、返回0兩數相等、返回正整數date1大) 
		/*如果是 -1:(N1-2個月)<e_C71*(最後一筆C71消滅所餘辦案期限不足2個月) 
		 *       0:(N1-2個月)=e_c71  
		 *       1:(N1-2個月)>e_C71
		 */
		
		//輸入案件遲延日及最後一筆C71迄日判斷是否不足2個月
        
		
		
		
		
		
//		System.out.println("compareDate():"+compareDate("1071001", "1071231"));
//		validateCDateThrowException("107o231");
//		System.out.println("1020504,1020601,1020505,1020507:"+getDayCoincidence("1020504","1020601","1020505","1020507"));
//		System.out.println("1020504,1020804,1020804,1021104:"+getDayCoincidence("1020504","1020804","1020804","1021504"));
//		System.out.println("1020504,1020804,1020804,1021104:"+getDayCoincidence("1020504","1020804","1020801","1021104"));
//		System.out.println("1020504,1020804,1020804,1021104:"+getDayCoincidence("1020504","1020804","1020804","1021104"));
//		System.out.println("test2:"+getDayCoincidence("1060206","1060209","1060207","1060211"));
//		System.out.println("1包含2:"+getDayCoincidence("1060206","1060227","1060207","1060211"));
//		System.out.println(compare("1060101","1050101"));//返回負數date1小、返回0兩數相等、返回正整數date1大
	}
	
	/**
	 * 
	 * @param  N_temp
	 * @param  N1
	 * @param  intervalList
	 * 
	 * */
	public static String getRealDelayDate(String N_temp,String N1, List<Interval> intervalList){
		String real_N1 = N1;
		int size = intervalList.size();//有幾筆C71
		if(size>0){
			//要判斷最後一筆C71消滅所餘辦案期限是否不足2個月
	        //1.[取倒數第二筆遲延日-2個月日期]
			String minusTwoMonDate = datePlus(N_temp, TYPE.MONTH, "-2");
			System.out.println("1.取倒數第二筆遲延日{"+N_temp+"}減2個月的日期:{"+minusTwoMonDate+"}");
			//2.取所有C71中最後一筆C71迄日
			String lastC71enddt = intervalList.get(size-1).getEnd(); //取最後一筆C71迄日
			System.out.println("2.共有{"+size+"}筆C71。取所有C71中最後一筆C71迄日:{"+lastC71enddt+"}");
			//3.判斷最後一筆C71消滅所餘辦案期限是否不足2個月
			System.out.println(compare(minusTwoMonDate,lastC71enddt));
			if(compare(minusTwoMonDate,lastC71enddt)==-1){ //(如果是 -1:(N1-2個月)<e_C71*(最後一筆C71消滅所餘辦案期限不足2個月); 0:(N1-2個月)=e_c71; 1:(N1-2個月)>e_C71) 
				int remain = getCDateDiff(lastC71enddt, N_temp);
				System.out.println("3.最後一筆C71消滅所餘辦案期限不足2個月，取得C71迄日至遲延日剩餘天數{"+remain+"}");
				real_N1 = datePlus(N1,TYPE.DATE,String.valueOf(remain));
				System.out.println("4.最終遲延日{"+N1+"}要補足不足2個月的剩餘天數{"+remain+"} =實際遲延日期 :{"+real_N1+"}");
			}
		}
		return real_N1;
	}
	
	
	public static String getExcludeOverlapEnddt(String N1, List<Interval> intervalList){ 
		//(第一階段 新的到期日)N1扣除有重疊C71的天數  //paolin
		Set<Interval> resultSet = getOverlap(intervalList);//取得所有重疊C71的天數
		int days=0;
		if(resultSet.size()>0){
			System.out.println("有重疊的區間:");
			for(Interval inter: resultSet){
				days += getCDateDiff(inter.getStart(),inter.getEnd());
				System.out.println(inter.getDateInterval());
			}
		}
		N1 = datePlus(N1,TYPE.DATE,String.valueOf(-days));
		System.out.println("累加所有C71後的到期日扣除重疊["+days+"]天=(第一階段 新的到期日)N1["+N1+"]");	
		return N1;
	}
}
