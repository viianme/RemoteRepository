// Created by robinwen 20090720
// for file uploading
package com.cpl.fileUtils;

import java.io.File;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;


public class FileUpload
{
	private FileUtil fu = new FileUtil();
	
	public class FileUploadInfo
	{
		public FileItem srcFile;
		public File dstFile;
		public String srcFilename;
		public String dstFilename;
		public boolean isUploaded;

		public FileUploadInfo()
		{
		}

		public FileUploadInfo(FileItem fi)
		{
			this.srcFile = fi;
		}

	}

	public boolean isChangeFilenameByTimeRule = false;
	private List<FileUploadInfo> fileList;

	public FileUpload()
	{
		fileList = new LinkedList<FileUploadInfo>();
	}

	public List<FileUploadInfo> getUploadList()
	{
		return fileList;
	}

	public int getUploadCount()
	{
		return fileList.size();
	}
	
	public FileUploadInfo getFileUploadInfo(int fileIndex)
	{
		int size = fileList.size();

		if (!(fileIndex < size && fileIndex >= 0))
			return null;

		return fileList.get(fileIndex);
	}
	
	public HashMap RequestToHashMap(HttpServletRequest request) throws Exception
	{
		HashMap result = new HashMap();
		
	    DiskFileItemFactory factory = new DiskFileItemFactory();
	    ServletFileUpload objUpload = new ServletFileUpload(factory);
	    
	    List fileItems = objUpload.parseRequest(request);
	    Iterator it = fileItems.iterator();
	    File file = null;

	    while(it.hasNext()) {
	        FileItem fi = (FileItem)it.next();

	        // ��r���A...�ptext���---�]�L�k������request��o��r��쪺��,�]���b�o��o
	        if(fi.isFormField()) {
	        	// key:���W��   value:����
	        	result.put(fi.getFieldName(), fi.getString("UTF-8"));	        	
	        }
	        // �D��r���A
	        else{
	        	FileUploadInfo objFU = new FileUploadInfo(fi);
	        	if( !objFU.srcFile.getName().equals("") )
	        		fileList.add(objFU);
	        }
	    }
	    return result;
	}

	public void uploadFile(String uploadPath) throws Exception
	{
	    File file = null;
	    if( !uploadPath.substring(uploadPath.length()-1).equals( java.io.File.separator ) )
	    	uploadPath += java.io.File.separator;
	    
	    //�W���ɮצs��
	    for (int n=0; n<fileList.size(); n++)
	    {
	    	FileUploadInfo objFU = fileList.get(n);
	    	FileItem fi = objFU.srcFile;
	    	
	    	String srcFile = fi.getName();
			String ext = srcFile.substring(srcFile.lastIndexOf(".") + 1);

			String rnd = String.valueOf(Math.random()).substring(2, 5);
	    	String dstFile = "";
	    	if (isChangeFilenameByTimeRule)
	    		dstFile += new SimpleDateFormat("HHmmss").format(Calendar.getInstance().getTime()) + rnd + "." + ext; //���ܤW�Ǫ��ɦW(�R�W: �ɶ� +�Ǹ�)
	    	else
	    		dstFile += srcFile.substring(srcFile.lastIndexOf(java.io.File.separator) + 1); //�����ܤW�Ǫ��ɦW

	    	if (!srcFile.equals(""))
	    	{
	    		fu.mkdir(uploadPath);
	    		file = new File(uploadPath + dstFile);
	            fi.write(file);

	            objFU.dstFile = file;
	            objFU.srcFilename = srcFile;
	            objFU.dstFilename = file.getAbsolutePath();
	            objFU.isUploaded = true;
	    	}
	    	else
	    	{
	            objFU.dstFile = null;
	            objFU.srcFilename = srcFile;
	            objFU.dstFilename = file.getAbsolutePath();
	            objFU.isUploaded = false;
	    	}
	    	System.out.println("�W���ɮצ�:" + uploadPath + dstFile);
	    }
    }
}
