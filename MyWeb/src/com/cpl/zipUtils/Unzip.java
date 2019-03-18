package com.cpl.zipUtils;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.List;

//import java.util.zip.ZipFile;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipFile;
import org.springframework.util.StringUtils;

import com.cpl.utils.GlobalUtils;

import de.idyl.crypto.zip.AesZipFileDecrypter;
import de.idyl.crypto.zip.impl.ExtZipEntry;

public class Unzip {
	Enumeration<ZipEntry> entries;
	ZipFile zipFile;
	static  String os = GlobalUtils.checkOS();
	private String passwd        = ""; 
	private String zipFromString = "";   //要從那個壓縮檔解壓縮
	private String zipToString   = "./"; //要解壓縮到那個目錄
	private boolean isDecrypt    = false;	 //解密
	private boolean containDir   = false;  //是否包含路徑

	public static void main(String[] args) {
		String zipFile = "C:\\Users\\1708045\\Desktop\\MENULIST.zip";
		String path    = "D:\\TPH";
		Unzip z = new Unzip();
		z.setUnzipPath(zipFile, path);
		z.writeZip();
	}
	
	/**
	 * 必需有apache ant 的 org.apache.tools.zip 套件。
	 * 例子: 
	 * String zipFile = "C:\\Users\\1708045\\Desktop\\MENULIST.zip";
	 * String path    = "D:\\TPH";
	 * UnzipUtils z = new UnzipUtils();
	 * z.setUnzipPath(zipFile, path);
	 * z.writeZip();
	 */
	public Unzip(){
		this.containDir = false;
	}
		
	/**
	 * @param containDir
	 * 解壓縮時是否包含原本的路徑資料
	 */
	public Unzip(boolean containDir) {
		this.containDir = containDir;
		
	}
	
	/**
	 * @param zipFile
	 * zip 檔名(包含路徑) 設定 zip 檔的位置
	 * 
	 * @param path
	 * 解壓縮到那個目錄，設定要解壓縮到那個目錄下
	 */
	public void setUnzipPath(String zipFile,String path){
		this.zipFromString = zipFile;
		UnzipTo(path);
	}
	
	/**
	 * 設定 zip 檔的位置
	 * @param zipFile
	 * zip 檔名(包含路徑)
	 */
	public void UnzipFrom(String zipFile) {
		this.zipFromString = zipFile;
	}
	
	/**
	 * 設定解密密碼
	 * @param passwd
	 */
	public void Decrypter(String passwd){
		this.passwd = passwd;
		this.isDecrypt = true;
	}
	
	/**
	 * 設定要解壓縮到那個目錄下
	 * 
	 * @param path
	 *            解壓縮到那個目錄
	 */
	public void UnzipTo(String path) {
		try {
			char index;
			index = path.charAt(path.length() - 1);
			if (os.equals("linux")) {
				if (index != '/')
					this.zipToString = path + "/";
				else
					this.zipToString = path ;
			} else {
				if (index != '\\')
					this.zipToString = path + "\\";
				else
					this.zipToString = path;
			}
			File f = new File(path);
			f.mkdirs();
			f = null;
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
	
	public static final void copyInputStream(InputStream in, OutputStream out)
		throws IOException {
		byte[] buffer = new byte[1024];
		int len;
		while ((len = in.read(buffer)) >= 0)
			out.write(buffer, 0, len);
		in.close();
		out.close();
	}
	
	/**
	 * 開始解壓縮
	 */
	public boolean writeZip(){
		boolean retVal = false;
		if (isDecrypt){
			retVal =unzipByDecypt();
		}else{
			retVal = unzip();
		}
		return retVal;
	}
	
	private boolean unzipByDecypt(){
		boolean retVal = false;
		AesZipFileDecrypter zipFile = null;
		try{
			zipFile = new AesZipFileDecrypter(new java.io.File( zipFromString ));
			retVal = unzipDirByDecrypt(this.zipToString,this.passwd,zipFile);
		}catch(Exception e){
			e.printStackTrace();
			retVal = false;
		}finally{
			if (zipFile!=null){
				try{
					zipFile.close();
				}catch(Exception e){
					e.printStackTrace();
				}
			}	
		}
		return retVal;
	}
	
	private boolean unzipDirByDecrypt(String dir,String passwd,AesZipFileDecrypter zipFile){
		boolean retVal = false;
		String dir1 = "";
		if (dir.indexOf( dir.length()-1 )!= File.separatorChar) dir+= File.separatorChar;
		List l = null;
		try{
			l = zipFile.getEntryList();
			String file = "";//記錄壓縮檔內  (路徑+檔名)
			String filename = ""; //只有檔名
			String tempfile = "";
			long filetime = 0;
			for (int i=0;i<l.size();i++ ){
				ExtZipEntry entry = (ExtZipEntry) l.get(i);
				file = entry.getName();	
				filetime = entry.getTime();
				java.io.File e = new java.io.File(dir + file);
				filename = e.getName();		//filename 只有檔名
				if (this.containDir){
					tempfile =  dir + file;
				}else{
					tempfile = dir + filename;	
				}
				zipFile.extractEntry(entry,new java.io.File(tempfile),passwd);
				this.setFileTime(tempfile,filetime);
			}
			retVal = true;
		}catch(Exception e){
			e.printStackTrace();
			retVal = false;
		}	
			
		l = null;	
		return retVal ;
	}
	
	public boolean unzip(){
		boolean retVal = false;
		try {
			zipFile = new ZipFile(zipFromString);

			entries = zipFile.getEntries();	
			while (entries.hasMoreElements()) {
				ZipEntry entry = (ZipEntry) entries.nextElement();

				if (entry.isDirectory()) {
					// Assume directories are stored parents first then children.
					//System.err.println("Extracting directory: " + entry.getName());
					// This is not robust, just for demonstration purposes.
					(new File(entry.getName())).mkdir();
					//System.out.println(" " + entry.getName());
					continue;
				}

				//System.err.println("Extracting file: " + entry.getName());
				String ddd = "";
				int index = -1;

				if (containDir == false) {
					if ((entry.getName()).lastIndexOf("/") != -1)
						index = (entry.getName()).lastIndexOf("/");
					else if ((entry.getName()).lastIndexOf("\\") != -1) {
						index = (entry.getName()).lastIndexOf("\\");
					}

					if (index != -1) {
						ddd = (entry.getName()).substring(index + 1, (entry.getName())
							.length());
					} else {
						ddd = entry.getName();
					}
				} else {
					//判斷 是否有 : ，表示 有路徑是 c:\ 或者是 d:\ ，只取\ 後面的路徑
					//例如 c:\test\test1 只要取 \test\test1 ，
					ddd = entry.getName();

					index = (entry.getName()).indexOf(":");
					if (index != -1) {
						ddd = (entry.getName()).substring(index + 2, (entry.getName())
							.length());
					}
					if (os.equals("win")) {
						ddd = StringUtils.replace(ddd, "/", "\\");
//						ddd = ut.StrTran(ddd, "/", "\\");
					} else {
						ddd = StringUtils.replace(ddd, "\\", "/");
//						ddd = ut.StrTran(ddd, "\\", "/");
					}
				}
				System.out.println("解壓縮到"+zipToString + ddd);
				createDir(zipToString + ddd);
				copyInputStream(zipFile.getInputStream(entry), new BufferedOutputStream(
					new FileOutputStream(zipToString + ddd)));
				
				setFileTime(entry,zipToString + ddd);
			}
			zipFile.close();
			retVal= true;
		} catch (IOException ioe) {
			System.err.println("Unhandled exception:");
			ioe.printStackTrace();
			retVal= false;
		}
		return retVal;
	}
	
	/*
	 * 將解壓縮後的檔案日期改回正確的時間
	 */
	private void setFileTime(ZipEntry zn,String dins){
		try{
			if (zn!=null){
				File f = new File(dins);
				f.setLastModified(zn.getTime());
				f = null;
			}
		}catch(Exception e){}	
	}
	
	/*
	 * 將解壓縮後的檔案日期改回正確的時間
	 */
	private void setFileTime(String filename,long filetime){
		try{	
				File f = new File(filename);
				if (f.exists())
					f.setLastModified(filetime);
				f = null;
			
		}catch(Exception e){}	
	}
	
	public void createDir(String path) {
		int index = -1;
		if (os.equals("win")) {
			index = path.lastIndexOf("\\");
		} else {
			index = path.lastIndexOf("/");
		}
		path = path.substring(0, index);
		
		File f = new File(path);
		if (!f.exists())
			f.mkdirs();
		f = null;
	}
	
}
