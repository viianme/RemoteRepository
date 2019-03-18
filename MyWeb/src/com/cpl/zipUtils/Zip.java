package com.cpl.zipUtils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;
import org.springframework.util.StringUtils;

import com.cpl.fileUtils.FileCopy;
import com.cpl.utils.GlobalUtils;

import de.idyl.crypto.zip.AesZipFileEncrypter;

public class Zip {

	static  String os = GlobalUtils.checkOS();
	private String  zipfile    = "";
	private FileOutputStream fos;
	private ZipOutputStream zos;
	private String  passwd     = "";     //加密密碼
	private boolean containDir = false;  //是否包含路徑
	private boolean isEncrypt  = false;  //是否加密
	private List <String> fileList = new ArrayList < String > ();//放置所有要加入 zip 的檔名名稱
	private String prefixPath = "";
	private static String SOURCE_FOLDER = "";
//	private String FileSeperator = System.getProperty("file.separator");
	
	public static void main(String[] args) {
		
		SOURCE_FOLDER = "C:\\Users\\1708045\\Desktop\\python";
		Zip zip = new Zip();
		zip.Encrypter("1234");
		zip.createZip("D:\\TPH.zip");
//		zip.generateFileList(new File(SOURCE_FOLDER));
//		zip.zipIt();
		zip.addFile(SOURCE_FOLDER);
		zip.writeZip();
		
		
	}

	/**
	 * org.apache.tools.zip.ZipOutputStream outZip = new org.apache.tools.zip.ZipOutputStream(response.getOutputStream());
	 * generateFileList(new File(SOURCE_FOLDER));
	 * zipIt(outZip);
	 */
	public Zip() {
		containDir = true;
	}
	/**
	 * @param containDir 是否在zip檔裡包含完整的路徑
	 */
	public Zip(boolean containDir) {
		this.containDir = containDir;
	}
	/**
	 * 設定壓縮檔密碼
	 * @param passwd
	 */
	public void Encrypter(String passwd){
		this.passwd = passwd;
		this.isEncrypt = true;
	}
	
	public void createZip(String zipfile) {
		try {
			//Step 1: Create the zip output stream
			//如zip檔不存在,則新增一個(含目錄)
			String newZipfile = zipfile.replace('\\', '/');
			this.zipfile = zipfile.replace('\\', '/');
			int index = newZipfile.lastIndexOf('/');
			String dir1 = newZipfile.substring(0, index);
			String file1 = newZipfile.substring(index + 1);
			File zipDir = new File(dir1);
			File zipFile = new File(dir1, file1);
			if (!zipDir.exists())
				zipDir.mkdirs();
			if (!zipFile.exists())
				zipFile.createNewFile();
			fos = new FileOutputStream(zipfile);
			zos = new ZipOutputStream(fos);
			zos.setMethod(ZipOutputStream.DEFLATED);
		} catch (IOException e) {
			System.out.println(e.getMessage());
		}
	}
	
	/**
	 * 增加檔案到 zip 檔，
	 * @param file    要增加到zip 檔的檔案，如果是目錄，則會將該目錄下的檔案做壓縮
	 */
	public void addFile(String file) {
		fileList.add(file);
	}
	
	/**
	 * 寫入zip 檔
	 * @return
	 */
	public boolean writeZip(){
		boolean retVal = false;
		try {
//			for (int i = 0; i < fileList.size(); i++) {
			for (String file: this.fileList) {
				//Step 2:Open the source data file
				//String dataFileName = (String) Entries.elementAt(i);
				String dataFileName = file;
				this.prefixPath = dataFileName;
				System.out.println("dataFileName=" + dataFileName);
				if ((checkFileOrDir(dataFileName)).equals("file")) {//檔案
					WriteIntoZip(dataFileName);
				} else { //目錄
					if (os.equals("linux")){
						this.prefixPath = StringUtils.replace(this.prefixPath,"\\","/");
						if ( prefixPath.charAt( prefixPath.length() -1 )!='/')
							prefixPath += "/";
					}else{
						this.prefixPath = StringUtils.replace(this.prefixPath,"/","\\");
						if ( prefixPath.charAt( prefixPath.length() -1 )!='\\')
							prefixPath += "\\";
					}
					WriteWithDir(dataFileName);
				}
			}
			zos.flush();

			//Step 6: Close the zip entry and other open streams
			zos.closeEntry();
			zos.close();
			
			retVal = true;
			//-------------加密---------------------
			if (this.isEncrypt){
				String tempZip = this.zipfile+"__";
				AesZipFileEncrypter enc = null;
				try{	
					enc = new AesZipFileEncrypter(tempZip); 
					enc.addAll( new java.io.File(this.zipfile), this.passwd );
					enc.close();
					
					File zf = new File(this.zipfile);
					if (zf.exists()) zf.delete();
					zf = null;
					FileCopy fc = new FileCopy();
					fc.copyFiles(tempZip,this.zipfile);
					fc = null;
					retVal = true;
				}catch(Exception eee){
					eee.printStackTrace();	
					retVal = false;
				}finally{
					
					File f = new File(tempZip);
					if (f.exists()) f.delete();
					
				}
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());

		}
		return retVal ;
	}
	
	//寫目錄下的檔案
	private void WriteWithDir(String dataFileName) {
		System.out.println("WriteWithDir =" + dataFileName);
		File file = new File(dataFileName);
		File[] fileList = file.listFiles();
		for (int j = 0; j < fileList.length; j++) {
			File subFile = (File) fileList[j];
			String dataFileName1 = "";
			dataFileName1 = subFile.getAbsolutePath();
			if (subFile.isFile()) //如果是檔案則寫檔案
			{
				WriteIntoZip(dataFileName1);
			} else { //如果是目錄則自己呼叫自己(WriteWithDir)
				WriteWithDir(dataFileName1);
			}
			subFile = null;
		}
		file = null;
	}
	
	//檢查是檔案或目錄
	private String checkFileOrDir(String data) {
		String retVal = "file";
		File file = new File(data);
		if (file.isDirectory())
			retVal = "dir";

		file = null;
		return retVal;
	}

	//將取得的檔案名稱寫到zip檔案
	private void WriteIntoZip(String dataFileName) {
		try {
			//System.out.println("壓縮 " + dataFileName + " ....");
			FileInputStream fis = new FileInputStream(dataFileName);
			BufferedInputStream sourceStream = new BufferedInputStream(fis);
			//Step 3: Create the zip entry
			File f = new File(dataFileName);
			ZipEntry theEntry = null;
			if (containDir) {
				
				theEntry = new ZipEntry(StringUtils.replace(dataFileName, prefixPath, ""));
			} else {
				theEntry = new ZipEntry(f.getName());
			}
			//修改日期
			theEntry.setTime(f.lastModified());
			
			//Step 4: Put the zip entry into the archive
			zos.putNextEntry(theEntry);
			//Step 5: Read source and write the data to the zip output stream
			int DATA_BLOCK_SIZE = 2000;
			byte[] data = new byte[DATA_BLOCK_SIZE];
			int bCnt = 0;
			while ((bCnt = sourceStream.read(data, 0, DATA_BLOCK_SIZE)) != -1) {
				zos.write(data, 0, bCnt);

			}
			sourceStream.close();
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
	
	public void zipIt(){
		zipIt(this.zos);
	}
	
	public void zipIt(org.apache.tools.zip.ZipOutputStream zos) {
        byte[] buffer = new byte[1024];
        String source = new File(SOURCE_FOLDER).getName();
        try {
            FileInputStream in = null;
            for (String file: this.fileList) {
            	System.out.println("file:"+file);
            	System.out.println(source + File.separator + file);
            	org.apache.tools.zip.ZipEntry ze = new org.apache.tools.zip.ZipEntry(source + File.separator + file);
                zos.putNextEntry(ze);
                try {
                    in = new FileInputStream(SOURCE_FOLDER + File.separator + file);
                    int len;
                    while ((len = in .read(buffer)) > 0) {
                        zos.write(buffer, 0, len);
                    }
                } finally {
                    in.close();
                }
            }
            zos.closeEntry();
            System.out.println("Folder successfully compressed");
        } catch (IOException ex) {
            ex.printStackTrace();
        } finally {
            try {
            	zos.flush();
                zos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void generateFileList(File node) {
        // add file only
        if (node.isFile()) {
            fileList.add(generateZipEntry(node.toString()));
        }
        if (node.isDirectory()) {
            String[] subNote = node.list();
            for (String filename: subNote) {
                generateFileList(new File(node, filename));
            }
        }
    }

    private String generateZipEntry(String file) {
        return file.substring(SOURCE_FOLDER.length() + 1, file.length());
    }
}
