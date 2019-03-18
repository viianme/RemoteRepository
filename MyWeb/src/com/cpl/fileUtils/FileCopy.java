package com.cpl.fileUtils;

import java.io.*;
import java.util.*;

public class FileCopy {
	

	public static List<String> ListDirectory(String s) {
		List<String> list = new ArrayList<>();
		try {
			addDirectory(s, list);
		} catch (IOException e3) {
		}
		return list;
	}

	private static boolean addDirectory(String s, List<String> list) throws IOException {
		File file = new File(s);
		File afile[] = file.listFiles();
		boolean flag = false;
		
		for (int i = 0; i < afile.length; i++)
			if (afile[i].isDirectory()) {
				String s1 = afile[i].getAbsolutePath();
				list.add(s1);
				
				System.out.println("path= " + s1);
				
				if (!addDirectory(s1, list))
					return false;
			}

		return true;
	}

	//--------------------------------------------------------------------------

	public static boolean delete(String s) {
		File file = new File(s);
		return file.delete();
	}


	//--------------------------------------------------------------------------

	public static boolean mkdirs(String s) {
		File file = new File(s);
		if (!file.exists())
			return file.mkdirs();
		else
			return true;
	}

	//--------------------------------------------------------------------------

	public static void setLastModified(String s) {
		Date date = Calendar.getInstance().getTime();
		File file = new File(s);
		file.setLastModified(date.getTime());
	}

	private static boolean WriteFile(String s, String s1) {
		try {
			BufferedWriter bw = 
				new BufferedWriter(
				new FileWriter(s));
			
			bw.write(s1);
			bw.close();

			return true;
		} catch (IOException e3) {
			return false;
		}
	}



	//--------------------------------------------------------------------------

    public static boolean copyDirectory(String s, String s1) throws IOException{
		boolean retVal = false;
	    File file = new File(s);
	    if (file.exists()){
	    	File afile[] = file.listFiles();
	    	if (afile!=null){
	        	
	        	int l = 0;
		        for(int i = 0; i < afile.length; i++)
		            if(afile[i].isFile())
		                l++;
		
		        File afile1[] = new File[l];
		        l = 0;
		        for(int j = 0; j < afile.length; j++)
		            if(afile[j].isFile())
		            {
		                afile1[l] = afile[j];
		                l++;
		            }
		
		        for(int k = 0; k < afile.length; k++)
		            if(afile[k].isDirectory())
		            {
		                String s2 = afile[k].getAbsolutePath();
		                if(!copyDirectory(s2, s1 + File.separator + afile[k].getName()))
		                    return false;
		            }
		
		        File file1 = new File(s1);
		        file1.mkdirs();
		        retVal= copyFiles(s1, afile1);
	    	}    
	    }
	    return retVal;
	}

	//--------------------------------------------------------------------------

	public static boolean copyFiles(String s, String s1) {
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		long sDate; //來源檔的日期

		File afile = new File(s);
		if (!afile.exists()) return false;
		
		sDate = afile.lastModified();
		try {
			bis = new BufferedInputStream(new FileInputStream(afile));
			bos = new BufferedOutputStream(new FileOutputStream(s1));
			byte[] buf = new byte[1024];
			int len;
			while ((len = bis.read(buf)) > 0) {
				bos.write(buf, 0, len);
			}
			bis.close();
			bos.close();
			
			File dFile = new File(s1);
			dFile.setLastModified(sDate);
			dFile = null;
		} catch (Exception e1) {
			e1.printStackTrace();
			return false;
		} finally{
			tryCloseFileFinally(bis);
			tryCloseFileFinally(bos);
		}
		afile = null;
		return true;
	}
    
    /**
     * @param s 目的目錄
     */
	public static boolean copyFiles(String s, File afile[]) throws IOException {
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		
		for (int i = 0; i < afile.length; i++) {
			String s1 = "";
			try {
				bis = 
					new BufferedInputStream(
					new FileInputStream(afile[i]));
				
				s1 = s + File.separator + afile[i].getName();
				
				bos = 
					new BufferedOutputStream(
					new FileOutputStream(s1));
				
			} catch (FileNotFoundException e1) {
				e1.printStackTrace();
			}
			
			do {
				int j = bis.read();
				if (j < 0)
					break;
				bos.write(j);
			} while (true);
			
			try {
				bis.close();
				bos.close();
				
				//修改日期，讓目的檔和源檔的日期一致
				long sDate = afile[i].lastModified(); 
				File dFile = new File(s1);
				dFile.setLastModified(sDate);
				dFile = null;
				
			} catch (IOException e3) {
				e3.printStackTrace();
				return false;
			}
		}

		return true;
	}

	//--------------------------------------------------------------------------

	public static boolean copyFile(String s, String s1){
		return copyFile(s, s1, false);
	}

	//--------------------------------------------------------------------------

	public static boolean rmDir(String s) throws IOException {
		try {
			File file = new File(s);
			if (!file.isDirectory())
				return false;
			File afile[] = file.listFiles();
			boolean flag = false;
			int l = 0;
			for (int i = 0; i < afile.length; i++)
				if (afile[i].isFile())
					l++;

			File afile1[] = new File[l];
			l = 0;
			for (int j = 0; j < afile.length; j++)
				if (afile[j].isFile()) {
					afile1[l] = afile[j];
					l++;
				}

			delFiles(afile1);
			for (int k = 0; k < afile.length; k++)
				if (afile[k].isDirectory()) {
					String s1 = afile[k].getAbsolutePath();
					if (!rmDir(s1))
						return false;
				}

			if (!file.delete())
				return false;
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		}
		return true;
	}

	
	/**
	 * 移動檔案
	 * 
	 * @param s
	 * @param s1
	 * @return
	 * @throws IOException
	 */
	public boolean moiveFile(String s, String s1) throws IOException {
		boolean retVal = false;
		if (copyFile(s, s1, true) == true) {
			File f = new File(s);
			retVal = f.delete();
		}
		return retVal;
	}
	
	
	/**
	 * 
	 * @param s
	 * @param s1
	 * @param overWrite 目的檔存在時，是否要覆寫
	 * @return
	 */
	public static boolean copyFile(String s, String s1, boolean overWrite) {
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		long sDate; // 來源檔的日期
		File afile = new File(s);
		if (!afile.exists()) return false;
		
		sDate = afile.lastModified();
		try {
			if (overWrite) {
				File desFile = new File(s1);
				if (desFile.exists())  desFile.delete();
				desFile = null;
			}
			bis = new BufferedInputStream(new FileInputStream(afile));
			bos = new BufferedOutputStream(new FileOutputStream(s1));
			
			byte[] buf = new byte[1024];
			int len;
			while ((len = bis.read(buf)) > 0) {
				bos.write(buf, 0, len);
			}
			bis.close();
			bos.close();

			File dFile = new File(s1);
			dFile.setLastModified(sDate);
			dFile = null;
		} catch (Exception e1) {
			e1.printStackTrace();
			return false;
		}finally {
			tryCloseFileFinally(bis);
			tryCloseFileFinally(bos);
		}
		afile = null;
		return true;
	}
	
	public static boolean delFiles(File afile[]) throws IOException {
		for (int i = 0; i < afile.length; i++)
			afile[i].delete();
		return true;
	}
	
	private static void tryCloseFileFinally(Closeable fi){
		if(fi!=null){
			try{
				fi.close();
			}catch (Exception e) {}
		}
	}
}