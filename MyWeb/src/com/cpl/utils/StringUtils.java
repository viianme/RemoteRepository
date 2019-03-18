package com.cpl.utils;

public class StringUtils {
	
	private static final String className = "com.cpl.utils.StringUtils";
	private static final String encoding  = "MS950";
	private static StringBuffer strBuffer = new StringBuffer("");

	/**
	null檢核，若屬null或""或空白，則傳回 true
	@param		o	        原始的Object
	@return		boolean
	*/
	public static boolean isEmpty(Object o){
		return (o == null || ((String)o).trim().length()==0 || ((String)o).equals("null"))?true:false;
	}
	
	/**
	null檢核，若屬null或""或空白，則傳回defaultValue的值
	@param		o	                      原始的Object
	@param		defaultValue	預設的String
	@return		String
	*/
	public static String isEmpty(Object o, String defaultValue){
		if(o == null || ((String)o).trim().length()==0 || ((String)o).equals("null")){
			return defaultValue;
		}else{
			return o.toString();
		}
	}
	
	/**
     *將傳入的inStr字串中，有oldStr者，以newStr取代後傳出
     *@param 	inStr   原始的字串內容
     *@param 	oldStr	要被取代的字串內容
     *@param 	newStr 	要取代後的字串內容
     *@return 			       傳回取代成newStr後的inStr
   */
	public static String replace(String str, String oldStr, String newStr) throws Exception{
		try{
			init();
			String tmpStr = str;
			int	pos1= 0, pos2= 0;
			while(tmpStr.indexOf(oldStr) != -1){
				pos1	= tmpStr.indexOf(oldStr);
				pos2	= pos1 + oldStr.length();
				strBuffer.append(tmpStr.substring(0, pos1));
				strBuffer.append(newStr);
				tmpStr	= tmpStr.substring(pos2);
			}
			strBuffer.append(tmpStr);
			return strBuffer.toString();
		}
		catch(Exception err){
			throw new Exception(className + ".replace Exception: \r\n" + err.toString());
		}
	}
	
	/**
     *前補字串內容
     *@param 	str     原始的字串內容
     *@param 	len	       要補足的字串長度
     *@param 	padStr  要補的字串
     *@return 		       傳回前補後的字串
   */
	public static String leftPad(String str, int len, String padStr){
		try{
			init();	
			if(isEmpty(str)) return "";
			for(int i=0;i<len-(str.length());i++){
				strBuffer.append(padStr);
			}
			strBuffer.append(str);
		}catch(Exception err){
			System.out.println(className + ".leftPad Exception: \r\n" + err.toString());
		}
		return strBuffer.toString();
	}
	
	/**
     *後補字串內容
     *@param 	str     原始的字串內容
     *@param 	len	       要補足的字串長度
     *@param 	padStr  要補的字串
     *@return 		       傳回後補後的字串
   */
	public static String rightPad(String str, int len, String padStr) throws Exception{
		try{
			init(str);
			if(isEmpty(str)) return "";
			while(strBuffer.length()<len){
				strBuffer.append(padStr);
			}
			return strBuffer.toString();
		}catch(Exception err){
			throw new Exception(className + ".rightPad Exception: \r\n" + err.toString());
		}
	}
	
	/**
	*EX: "abcabcabc" = clone("abc", 3)
	傳回一特定長度的重複字元字串
	@param 	str	指定要重覆的字串內容
	@param 	times 	指定要重覆的次數
	@return 傳回重覆次數後的字串內容
	*/
	public static String clone(String str, int times) throws Exception{
		try{
			init();
			int i = times;
			while(i > 0){
				i--;
				strBuffer.append(str);
			}
			return strBuffer.toString();
		}catch(Exception err){
			throw new Exception(className + ".clone Exception: \r\n" + err.toString());
		}
	}
	
	/**
	*EX: "000" = cloneStr('0', 3)
	傳回一特定長度的重複字元字串
	@param 	charStr	指定要重覆的字串內容
	@param 	len 	指定要重覆的次數
	@return 傳回重覆次數後的字串內容
	*/
	public static String clone(char charStr, int times) throws Exception{
		try{
			init();
			int i=times;
			while(i > 0){
				i--;
				strBuffer.append(charStr);
			}
			return strBuffer.toString();
		}catch(Exception err){
			throw new Exception(className + ".clone Exception: \r\n" + err.toString());
		}
	}
	
	/**
     *將字串反向, 例如: 傳入 '1234', 傳回 '4321'
     *@param 	str     原始的字串內容
     *@return 		       傳回反向字串
   */
	public static String reverse(String str) throws Exception{
		try{
			init();	
			for(int i=str.length()-1; i>=0 ; i--){
				strBuffer.append(str.charAt(i));
			}
			return strBuffer.toString();
//			return strBuffer.reverse().toString();
		}catch(Exception err){
			throw new Exception(className + ".reverse Exception: \r\n" + err.toString());
		}
	}
	
	/**
	取得 Tag 定義中所有值陣列 Exp: this is 【aa】 a test 【bb】 --> return {"aa", "bb"}
	@param	str	取出 Tag 資料的字串
	@return 取出後的陣列
	*/
	public static String[] getTags(String str) throws Exception{
		try{
			String[] tmpAry    = str.split("】");
			String[] resultAry = new String[tmpAry.length];
			int pos1=0, pos2=0;
			for(int i=0; i<tmpAry.length;i++){
				pos1 = tmpAry[i].indexOf("【")+1;
				pos2 = tmpAry[i].length();
				resultAry[i] = tmpAry[i].substring(pos1, pos2);
			}
			return resultAry;
		}catch(Exception err){
			throw new Exception(className + ".getTags Exception: \r\n" + err.toString());
		}
	}
	
	/**
	將含有半形的字元 str 改為全形的傳回
	@param	charStr	含有半形的字元
	@return 傳回已改為全形的字元
	 * @throws Exception 
	*/
	public static String convertToFullWidth(char charStr) throws Exception{
		try{
			init(charStr);
			String result ="";
			byte[]	byteAry	= strBuffer.toString().getBytes();
			if(byteAry.length >=2){             //為全形字則傳回自己
				result = strBuffer.toString();
			}else{
				byte[]	resultByteAry	= {0, 0};
				resultByteAry[0]	= -94;
				int	currByteNum	= Integer.parseInt(Byte.toString(byteAry[0]));
				//0 - 9 --> ０ - ９
				if (currByteNum >= 48 && currByteNum <= 57){
					resultByteAry[1]	= Byte.parseByte(Integer.toString(currByteNum - 129));
				}
				//a - z, A - Z --> Ａ - Ｚ
				if ((currByteNum >= 97 && currByteNum <= 122) || (currByteNum >= 65 && currByteNum <= 90)){
					if (currByteNum >= 97 && currByteNum <= 122)    //a - z
						resultByteAry[1]	= Byte.parseByte(Integer.toString(currByteNum - 146));
					else	                                        //A - Z
						resultByteAry[1]	= Byte.parseByte(Integer.toString(currByteNum - 114));
				}
				result	= new String(resultByteAry, encoding);
	      	}
      		if (charStr == ',') result	= "，";
        	return result;
		}catch(Exception err){
			throw new Exception(className + ".convertTofullWidth Exception: \r\n" + err.toString());
		}
	}
	
	/**
	將傳入的字串中，有半形的英文或數字改為全形後傳出
	@param 	str	原始的字串內容
	@return 傳回將半形改為全形的字串傳出
	*/
	public static String convertToFullWidth(String str) throws Exception{
		try{
			if(isEmpty(str)) return "";
			char [] charAry = str.toCharArray();
			StringBuffer	strBuffer	= new StringBuffer();
			for(int i = 0; i < charAry.length; i++){
				strBuffer.append(convertToFullWidth(charAry[i]));
			}
			return strBuffer.toString();
		}catch(Exception err){
			throw new Exception(className + ".convertTofullWidth Exception: \r\n" + err.toString());
		}
	}
	
	/**
	檢查傳入字串的長度是否未超過設定長度
	@param	str	原始字串
	@param	length	檢核的長度
	@return 檢查的結果
	 * @throws Exception 
	*/
	public static boolean checkLength(String str, int length) throws Exception{
		try{
			return str.length() <= length? true:false;
		}catch(Exception err){
			throw new Exception(className + ".checkLength Exception: \r\n" + err.toString());
		}
	}
	
	/**
	清除 str 字串左邊的空白
	@param	str	要清除空白的原始字串
	@return 清除左邊空白後的字串
	*/
	public static String ltrim(String str) throws Exception{
		try{
			int i =0;
			while(str.charAt(i) == ' '){
				i++;
			}
			return str.substring(i,str.length());
		}catch(Exception err){
			throw new Exception(className + ".ltrim Exception: \r\n" + err.toString());
		}
	}
	
	 /**
	    **清除str字串前後的空白
	    *@param 	str 要清除空白的原始字串
	    *@return 		清除前後邊空白後的字串
	   */
	public static String trim(String str) throws Exception{
		try{
			return ltrim(rtrim(str));
		}catch(Exception err){
			throw new Exception(className + ".trim Exception: \r\n" + err.toString());
		}
	}
	
	/**
	清除 str 字串右邊的空白
	@param	str	要清除空白的原始字串
	@return 清除右邊空白後的字串
	*/
	public static String rtrim(String str) throws Exception{
		try{
			int i =str.length();
			while(str.charAt(i-1) == ' '){
				i--;
			}
			return str.substring(0,i);
		}catch(Exception err){
			throw new Exception(className + ".rtrim Exception: \r\n" + err.toString());
		}
	}
	
	/**
	將數字字串的零去掉傳回 Exp:001 --> 1
	@param		strNum	        數字字串
	@param		defaultvalue	預設的String
	@return		String
	*/
	public static String getNumStr(String strNum) throws Exception{
		try{
			if (isEmpty(strNum)) return "";	
			return Long.toString(Long.parseLong(strNum));
		}
		catch(Exception err){
			throw new Exception(className + ".getNumStr(String) Exception: \r\n" + err.toString());
		}
	}
	
	/**
	將字串加上單引號  addQuote("甲,乙,丙") return '甲','乙','丙'
	@param		str	        字串(可傳入多組用,號隔開)
	@return		String
	*/
	public static String addQuote(String str) throws Exception{
		try{
			init();
			if (isEmpty(str)) return "''";	
			if(str.indexOf(",")==-1){
				return strBuffer.append("'").append(str).append("'").toString();
			}else{
				String[] temps = str.split(",");
				for(String temp:temps){
					strBuffer.append("'").append(temp).append("',");
				}
				return strBuffer.substring(0, strBuffer.length()-1).toString();
			}
		}
		catch(Exception err){
			throw new Exception(className + ".addQuote(String) Exception: \r\n" + err.toString());
		}
	}
	
	
	/**
	判斷輸入的兩個字串是否一樣
	@param		str1	     要判斷的字串
	@param      str2            要判斷的字串
	@return		boolean
	*/
	public static boolean equals(String str1,String str2) throws Exception{
		try{
			return str1.equals(str2)?true:false;
		}catch(Exception err){
			throw new Exception(className + ".equals Exception: \r\n" + err.toString());
		}
	}
	
	/**
	判斷輸入的兩個字串是否一樣  Ex:equals("乙","甲","乙") return true
	@param		str1	     要判斷的字串
	@param      str2s      要判斷的字串(可輸入多個 用,號隔開)
	@return		boolean
	*/
	public static boolean equals(String str1, String... str2s) throws Exception {
		for(String str2 : str2s) {
			if(equals(str1, str2)) {
				return true;
			}
		}
		return false;
	}
	
	private static void init(String str){
		init();	
		strBuffer.append(str);
	}
	
	private static void init(char charStr){
		init();	
		strBuffer.append(charStr);
	}
	
	private static void init(){
		strBuffer.setLength(0);	
	}
	

	public static void main(String[] args) throws Exception {
		String inStr ="abcdefg", oldStr ="d", newStr ="k";
		System.out.println(replace(inStr, oldStr, newStr));
		System.out.println(reverse(inStr));
		System.out.println(rightPad("123",8,"0"));
		String[] r = getTags("this is 【aa】 a test 【bb】");
		for(String str:r){
			System.out.println(str);
		}
		System.out.println(clone("abc",3));
		System.out.println(convertToFullWidth('8'));
		System.out.println(getNumStr("012304"));
		System.out.println(addQuote("甲,乙,丙,"));
		System.out.println(equals("乙","甲","乙"));
		
		System.out.println(isEmpty("乙"));
		
		
		
		
	}
	
}
