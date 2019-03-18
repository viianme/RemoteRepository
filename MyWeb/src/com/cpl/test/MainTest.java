package com.cpl.test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Vector;

import com.cpl.utils.DateUtils;
import com.cpl.utils.DateUtils.DATE_SEPARATOR;

public class MainTest {

	public static void main (String [] args){
		
		System.out.println(DateUtils.getFormatCDate("1070101", DATE_SEPARATOR.CHINESE));
		
		
		String Str ="001";
		System.out.println(Str.matches("001"));
		
		
		String conC70 = "HI".indexOf("A")!=-1?"Y":"N";
		System.out.println("conC70:"+conC70);
		
        Vector<String> vr = new Vector<String>();
        vr.addElement("001");
        vr.addElement("002");
        vr.addElement("003");
        vr.addElement("004");
        
        System.out.println("vr:"+vr);
        
        
        
        String [] strAry = vr.toArray(new String[0]);
        
        for(String s:strAry){
        	System.out.println(s);
        }
        
        String dptcd = "001,002,003,004,005";
//        List<String> dptcds =  new LinkedList<String>(Arrays.asList(dptcd.split(",")));
        String printdptcd = "001,003,005";       
//        List<String> printdptcds = new LinkedList<String>(Arrays.asList(printdptcd.split(",")));
        
        String [] list = dptcd.split(",");
        String [] checked = printdptcd.split(",");
        
        Vector<String> v = new Vector<String>();
        v.addElement("001");
        v.addElement("詩");
        v.addElement("003");
        v.addElement("春");
        
        String [] dd = v.toArray(new String[0]);
        for(String a:v.toArray(new String[0])){
        	System.out.println("a:"+a);
        }
        
        
        
        String notDataDpt="";
        for(int j=0 ; j<v.size(); j++){
        	String t_dptcd = v.get(j);
        	
		    for(int i = 0; i < list.length; i++) {
		        if(!Arrays.asList(dd).contains(list[i]))
		        	notDataDpt += list[i] + ",";
		    }
        	
        }
        System.out.println("noData:"+notDataDpt);
        
//        ArrayList<String> ar = new ArrayList<String>();
        String nodata = "";
        for(int i = 0; i < list.length; i++) {
            if(!Arrays.asList(checked).contains(list[i]))
//            ar.add(list[i]);
            nodata += list[i] + ",";
        }
     
        System.out.println(nodata);
        /*
        System.out.println("printdptcds:"+printdptcds);
        System.out.println("printdptcds:"+printdptcds.get(0));
        String nodata ="";
        for(int i=0;i<dptcds.size();i++){
        	String d = printdptcds.get(i);
        	for(int j=0;j<dptcds.size();j++){
        		String s = dptcds.get(j);
        		
        		
        			
        	}
        	
        }
        */
        
        /*
        String nodata ="";
        for(String s:dptcds){
        	System.out.println("s:"+s);
        	for(int i=0;i<printdptcds.size();i++){
        		System.out.println(printdptcds.get(i));
        		if(s.matches(printdptcds.get(i))){
        			printdptcds.remove(i);  
        		}else{
        			nodata += s +",";
        		}
        	}
        }
        */
//        System.out.println("nodata:"+nodata);
	}
	
	public String sys2owner(String crtid,  String sys){
		String retVal = sys;
		if(crtid!=null && crtid.trim().length()==3 && crtid.substring(2).equals("E")){ //加入簡易判斷
			retVal = crtid;
		} else if (sys.equals("H")) {
			retVal = "H";
		} else if (sys.equals("U") || sys.equals("O") || sys.equals("V")) {
			retVal = "V";
		} else if (sys.equals("I")) {
			retVal = "I";
		} else if (sys.equals("C") || sys.equals("S")) {
			retVal = "S";
		} else if (sys.equals("K")) {
			retVal = "K";
		} else if (sys.equals("N")) {
			retVal = "N";
		} else if (sys.equals("L")) {
			retVal = "L";
		} else if (sys.equals("Y")) {
			retVal = "H";
		} else if (sys.equals("Z")) {
			retVal = "V";
		}
		return retVal;
	}

	
}
