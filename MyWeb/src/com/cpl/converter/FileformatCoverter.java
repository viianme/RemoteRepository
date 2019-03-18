package com.cpl.converter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

import org.apache.poi.xwpf.converter.xhtml.XHTMLConverter;
import org.apache.poi.xwpf.converter.xhtml.XHTMLOptions;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.docx4j.Docx4J;
import org.docx4j.Docx4jProperties;
import org.docx4j.convert.out.HTMLSettings;
import org.docx4j.openpackaging.exceptions.Docx4JException;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.springframework.stereotype.Component;

import com.aspose.words.License;

/**
 * 檔案格式轉換
 * @author wengchi
 *
 */
@Component
public class FileformatCoverter {
	
	public static void main(String [] args) throws Exception{
		License aposeLic = new License();
		FileformatCoverter converter = new FileformatCoverter();
		InputStream is = converter.getClass().getResourceAsStream("aspose-license.xml");
		aposeLic.setLicense(is);
		converter.docx2pdf("D:\\test.docx","D:\\test.pdf");
	}
	
	/**
	 * 建構式
	 * @param request
	 */
	public FileformatCoverter(){	
	}
	
	public void init() throws Exception{	
		License aposeLic = new License();
		InputStream is = this.getClass().getResourceAsStream("aspose-license.xml");
		aposeLic.setLicense(is);
	}
	
	/**
	 * 關閉 轉換元件
	 */
	public void shutdown(){
		System.out.println( "FileformatCoverter#shutdown!" );
	}
	
	/**
	 * docx 頧� pdf 
	 * @throws Exception 
	 * @throws InterruptedException
	 * @throws ExecutionException
	 * @throws TimeoutException 
	 */
	public boolean docx2pdf (String docxfile ,String pdffile) throws Exception{
		com.aspose.words.Document d = new com.aspose.words.Document( docxfile);
		d.save( pdffile,com.aspose.words.SaveFormat.PDF);
		return true;
		
	}
	
	/**
	 * docx 轉 html (apache.POI) 不包含圖片轉換
	 * @param filepath
	 * @param outpath
	 * @return
	 */
	public boolean docx2html(String filepath,String outpath) {
		try {
			InputStream input = new FileInputStream(filepath);
	        XWPFDocument document = new XWPFDocument(input);
	        XHTMLOptions options = XHTMLOptions.create();
	        
	        OutputStream out = new FileOutputStream(new File(outpath));
	        XHTMLConverter.getInstance().convert(document, out, options);
	        return true;
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
    }
	
	/**
	 * 
	 *  docx 轉 html (docx4j) 不包含圖片轉換
	 * @param filepath
	 * @param outpath
	 * @return
	 */
	public boolean docxToHtml(String filepath,String outpath)
	{
	      
	    try {
	    	WordprocessingMLPackage wordMLPackage= Docx4J.load(new java.io.File(filepath));  
			  
		    HTMLSettings htmlSettings = Docx4J.createHTMLSettings();  
		    //String imageFilePath=outpath.substring(0,outpath.lastIndexOf("/")+1)+"/images";  
		    //htmlSettings.setImageDirPath(imageFilePath);  
		    //htmlSettings.setImageTargetUri( "images");  
		    htmlSettings.setWmlPackage(wordMLPackage);  

		    String userCSS = "html, body, div, span, h1, h2, h3, h4, h5, h6, p, a, img,  ol, ul, li, table, caption, tbody, tfoot, thead, tr, th, td " +  
		            "{ margin: 0; padding: 0; border: 0;}" +  
		            "body {line-height: 1;} ";  
		      
		    htmlSettings.setUserCSS(userCSS);  

		    OutputStream os;  
		    
			os = new FileOutputStream(outpath);
			Docx4jProperties.setProperty("docx4j.Convert.Out.HTML.OutputMethodXML", true);  
			Docx4J.toHTML(htmlSettings, os, Docx4J.FLAG_EXPORT_PREFER_XSL);
			
			return true;
		} catch (FileNotFoundException e ) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}  catch (Docx4JException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}
	
	
	/**
	 * 
	 *  docx 轉 html (asponse) 不包含圖片轉換
	 * @param filepath
	 * @param outpath
	 * @return
	 * @throws Exception 
	 */
	public boolean docxToHtml2(String filepath,String outpath) throws Exception
	{
	      

		com.aspose.words.Document d = new com.aspose.words.Document( filepath);
		//d.save( webRoot + File.separator + "10173237309_001.pdf");
		d.save( outpath, com.aspose.words.SaveFormat.HTML);
		return true;
	}
	
	
	
	
	private void mkdir(String path){
		File f = new File(path);
		if (!f.exists()) f.mkdirs();
		f = null;
	}
	
}
