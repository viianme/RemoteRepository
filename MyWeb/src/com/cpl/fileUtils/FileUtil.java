package com.cpl.fileUtils;
import com.sertek.sys.Project;
import com.sertek.util.*;

import sun.misc.BASE64Encoder;

import java.util.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.charset.Charset;
import java.text.*;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.tools.zip.ZipEntry;

//��������蝔��

public class FileUtil
{
	/**
	 * ����
	 */
	public final static int DESC = 1;	//������ 
	/**
	 * ����
	 */
	public final static int ASC = 0;	//������
	
	private util_date ud = new util_date();
	private utility ut = new utility();

	public FileUtil(){}


/**
��:String path
隤芣��:撠楝敺葉���'\'(�"\\")頧'/'
*/
	public String changeSlopeToRL(String path)
	{
		return path.replace('\\', '/');		
	}
	

/**
��:String path
隤芣��:撠楝敺��'/'���'\\'頧'\'
*/
	public String changeSlopeToLR(String path)
	{
		return path.replace('/', '\\');
	}
	


/**
��:String path, String cpath, String spath
隤芣��:撠for�����楝敺�[for AP Server]��楝敺�(���path��path��靘��,銝衣絞銝�'/'���'\')
spath => exp:/nw/k/type, ��User.readString(...)����
cpath => exp:N:\type, ��User.readString(...)����
憒�頝臬�歇�client path, ���霈�
*/
	public String changeToServerPath(String path, String cpath, String spath)
	{
		spath = changeSlopeToRL( spath );
		cpath = changeSlopeToRL( cpath );
		path = changeSlopeToRL( path );	
		if( path.indexOf( spath )!=0 )
		{
			if( path.indexOf( cpath )==0 )
				path = spath + path.substring( cpath.length() );
			else
				path = spath + path;
		}

		return path;
	}


/**
��:String path, String cpath, String spath
隤芣��:撠for AP Server]��楝敺�[for�����楝敺�(���path��path��靘��,銝衣絞銝�'/'���'\')
spath => exp:/nw/k/type, ��User.readString(...)����
cpath => exp:N:\type, ��User.readString(...)����
憒�頝臬�歇�client path, ���霈�
*/
	public String changeToClientPath(String path, String cpath, String spath)
	{
		spath = changeSlopeToRL( spath );
		cpath = changeSlopeToRL( cpath );
		path = changeSlopeToRL( path );	
		if( path.indexOf( cpath )!=0 )
		{
			if( path.indexOf( spath )==0 )
				path = cpath + path.substring( spath.length() );
			else
				path = cpath + path;
		}

		return path;
	}
	

/**
��:�
隤芣��:���銵憓�s�linux��in
*/
	public String checkOS()
	{
		String s = "linux";
		String s1 = System.getProperty("file.separator");
		if(s1.equals("\\"))
			s = "win";
		return s;
	}


/**
��:String path, String cpath, String spath
隤芣��:撠for AP Server]��楝敺�[for�����楝敺�
spath => exp:/nw/k/type, ��User.readString(...)����
cpath => exp:N:\type, ��User.readString(...)����
*/
	public String modifyPath(String path, String cpath, String spath)
	{
		if( "win".equals(checkOS()) )
			return changeToClientPath( path, cpath, spath );
		else
			return changeToServerPath( path, cpath, spath );
	}
	
	
/**
��:String path
隤芣��:����銋���蔭嚗�甇斤����摰���摮
*/	
	public boolean checkFile( String path )
	{
		path = changeSlopeToRL( path );
		int index = path.lastIndexOf( '/' );
		String dir = path.substring( 0, index );
		String file = path.substring( index+1 );
		File myFile = new File(dir, file);
		return myFile.exists();	
	}	


/**
��:String path
隤芣��:����銋���蔭嚗�甇斤����摰���摮
�銝�, ��遣蝡迨銝��������, �瑼�遣蝡仃����, ���alse
*/	
	public boolean setFile( String path )
	{
		path = changeSlopeToRL( path );
		int index = path.lastIndexOf( '/' );
		String dir = path.substring( 0, index );
		String file = path.substring( index+1 );
		File myFile = new File(dir, file);
		if( myFile.exists() )
			return true;
		else
		{
			File newDir = new File(dir);
			if( !newDir.exists() )
				if( !newDir.mkdirs() )
					return false;
			try 
			{
				return myFile.createNewFile();
			} 
			catch(Exception ex)
			{
				System.out.println("fileUtil.setFile error:"+ex);
				return false;
			}
			
		}
	}



/**
��:String path, String type
隤芣��:����銋���蔭嚗�甇斤����摰��摨衣憭��
�type="byte", �������雿�yte�摨�, �type="char", �������雿���(��������,銝��葉���������)
�瑼���,��誑-1������
*/	
	public long checkFileSize( String path, String type )
	{
		path = changeSlopeToRL( path );
		int index = path.lastIndexOf( '/' );
		String dir = path.substring( 0, index );
		String file = path.substring( index+1 );
		File myFile = new File( changeSlopeToLR(dir), changeSlopeToLR(file) );
		if(myFile.exists())
		{
			if("byte".equals(type))
				return myFile.length();
			else
			{
				try
				{
					System.out.println("start");
					BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(myFile), "MS950"), 32768);
					long size = 0;
					do
					{
						if( in.read()==-1 )
							break;
						else
							size++;
					}
					while(true);
					
					in.close();
					return size;
				}
				catch(Exception ex)
				{
					System.out.println("fileUtil.checkFileSize error:"+ex);
					return -1;
				}
			}
		}
		else
			return -1;
	}


/**
��:String path, String type
隤芣��:����銋���蔭嚗�甇斤����摰��耨�����蒂靘�閮剖����
��type="0":����Ⅳ瘞�僑��, type="1":���蝣潭������(24��), type="3":������, 銝剝�誑���(,)����
�瑼���,��誑"0000000","000000","000000,000000"������
*/	
	public String checkFileDate( String path, String type )
	{
		path = changeSlopeToRL( path );
		int index = path.lastIndexOf( '/' );
		String dir = path.substring( 0, index );
		String file = path.substring( index+1 );
		File myFile = new File(dir, file);
		if( myFile.exists() )
		{
			java.util.Date fileDate = new java.util.Date( myFile.lastModified() );
			SimpleDateFormat tf = new SimpleDateFormat ( "yyyyMMdd,HHmmss" );//憭批�神銵函內��儔銝��
			String year = ""+( Integer.parseInt(tf.format(fileDate).substring(0,4))-1911 );
			if( year.length()==2 )
				year = "0" + year;
			else if( year.length()==1 )
				year = "00" + year;
				
			if( "0".equals(type) )
				return year + tf.format(fileDate).substring(4,8);
			else if ( "1".equals(type) )
				return tf.format(fileDate).substring(9);
			else
				return year + tf.format(fileDate).substring(4);
		}
		else
		{
			if( "0".equals(type) )
				return "0000000";
			else if ( "1".equals(type) )
				return "000000";
			else
				return "0000000,000000";
		}
	}


/**
��:String oldPath, String newPath
隤芣��:�霈���迂����雿蔭
��銵仃���(靘�:���瘜���,������蝑�),��誑false������
*/	
	public boolean changeNewPath( String oldPath, String newPath )
	{
		if( oldPath!=null )
			if( oldPath.equals(newPath) )
				return false;
		
		oldPath = changeSlopeToRL( oldPath );
		int index = oldPath.lastIndexOf( '/' );
		String dir1 = oldPath.substring( 0, index );
		String file1 = oldPath.substring( index+1 );
		File myFile1 = new File(dir1, file1);
		
		newPath = changeSlopeToRL( newPath );
		index = newPath.lastIndexOf( '/' );
		String dir2 = newPath.substring( 0, index );
		String file2 = newPath.substring( index+1 );
		File newDir = new File(dir2);
		File myFile2 = new File(dir2, file2);
		
		if( !myFile1.exists() || myFile2.exists() )
			return false;
		
		if( !newDir.exists() )
			if( !newDir.mkdirs() )
				return false;
				
		try 
		{
			return myFile1.renameTo( myFile2 );
		} 
		catch(Exception ex)
		{
			System.out.println("fileUtil.changeNewPath error:"+ex);
			return false;
		}
	}

	/**
	��:String oldPath, String newPath
	隤芣��:�霈���迂����雿蔭嚗�瑼������
	��銵仃���(靘�:���瘜���,������蝑�),��誑false������
	*/	
		public boolean changeNewPath_cover( String oldPath, String newPath )
		{
			if( oldPath!=null )
				if( oldPath.equals(newPath) )
					return false;
			
			oldPath = changeSlopeToRL( oldPath );
			int index = oldPath.lastIndexOf( '/' );
			String dir1 = oldPath.substring( 0, index );
			String file1 = oldPath.substring( index+1 );
			File myFile1 = new File(dir1, file1);
			
			newPath = changeSlopeToRL( newPath );
			index = newPath.lastIndexOf( '/' );
			String dir2 = newPath.substring( 0, index );
			String file2 = newPath.substring( index+1 );
			File newDir = new File(dir2);
			File myFile2 = new File(dir2, file2);
			
			if( !myFile1.exists() )
				return false;
			
			if( !newDir.exists() )
				if( !newDir.mkdirs() )
					return false;
					
			try 
			{
				if( myFile2.exists() )
					myFile2.delete(); 
					
				return myFile1.renameTo( myFile2 );
			} 
			catch(Exception ex)
			{
				System.out.println("fileUtil.changeNewPath error:"+ex);
				return false;
			}
		}

/**
��:String path
隤芣��:����銋���蔭嚗�迨�����摰���(銝虫������)
�瑼��憭望���, ���alse
*/	
	public boolean delFile( String path )
	{
		path = changeSlopeToRL( path );
		int index = path.lastIndexOf( '/' );
		String dir = path.substring( 0, index );
		String file = path.substring( index+1 );
		File myFile = new File(dir, file);
		if( !myFile.exists() || !myFile.isFile()  )
			return false;
		else
		{
			try 
			{
				return myFile.delete();
			} 
			catch(Exception ex)
			{
				System.out.println("fileUtil.delFile error:"+ex);
				return false;
			}
			
		}
	}


/**
��:String path
隤芣��:����銋���蔭嚗�迨����(���������������)
�����憭望���, ���alse
*/	
	public boolean delDir( String path )
	{
		path = changeSlopeToRL( path );
		File myFile = new File( path );
		if( !myFile.exists() || !myFile.isDirectory()  )
			return false;
		else
		{
			try 
			{
				return myFile.delete();
			} 
			catch(Exception ex)
			{
				System.out.println("fileUtil.delDir error:"+ex);
				return false;
			}
			
		}
	}


/**
��:String sourcePath, String targetPath
隤芣��:瑼�sourcePath銴ˊ�targetPath,����
��銵仃���(靘�:���瘜���,������蝑�,���瑼�歇摮蝑�),��誑false������
*/	
	public boolean copyFile( String sourcePath, String targetPath )
	{
		return copyFile( sourcePath, targetPath,false);
	}

		/**
		 * 瑼�sourcePath銴ˊ�targetPath,����
		 * @param sourcePath 靘���
		 * @param targetPath �����
		 * @param overwrite 憒�� targetPath 摮嚗�閬���
		 * @return (靘�:���瘜���,������蝑�),��誑false������
		 */
		public boolean copyFile( String sourcePath, String targetPath , boolean overwrite )
		{
			if( sourcePath!=null )
				if( sourcePath.equals(targetPath) )
					return false;
			
			sourcePath = changeSlopeToRL( sourcePath );
			int index = sourcePath.lastIndexOf( '/' );
			String dir1 = sourcePath.substring( 0, index );
			String file1 = sourcePath.substring( index+1 );
			File myFile1 = new File(dir1, file1);
			
			targetPath = changeSlopeToRL( targetPath );
			index = targetPath.lastIndexOf( '/' );
			String dir2 = targetPath.substring( 0, index );
			String file2 = targetPath.substring( index+1 );
			File newDir = new File(dir2);
			File myFile2 = new File(dir2, file2);
			
			if( !myFile1.exists() )
				return false;
			
			
			//�閬����嚗�� 閬�神������������� 
			if (myFile2.exists()){
				if (overwrite == true){
					if (myFile2.delete()==false){
						System.out.println("�� " + myFile2.getAbsolutePath() + "憭望��" );	
						return false;
					}
				}else{
					return false;
				}
			}
			
			try
			{
				if( !newDir.exists() )
					if( !newDir.mkdirs() )
						return false;
					
				if( !myFile2.createNewFile() )
					return false;
					
				int size = 32768;
				byte temp[] = new byte[32768];
							
				FileInputStream in = new FileInputStream(myFile1);
				FileOutputStream out = new FileOutputStream(myFile2);
				
				for(int i=0; i<myFile1.length()/32768+1; i++)	
				{
					 
					 if( i == myFile1.length()/32768)
					 	size = (int)(myFile1.length()-i*32768);
					 in.read(temp,0,size);
					 out.write(temp,0,size);
				}
					
				in.close();
				out.flush();
				out.close();
				myFile2.setLastModified( myFile1.lastModified() );
				return true;
			}
			catch(Exception e)
			{
				System.out.println("fileUtil.copyFile error:"+e);
				return false;
			}		
		}


/**
��:String path, String chkString
隤芣��:瑼Ｘpath��������洵銝�銵������葡(chkString)
��銵仃���(靘�:���瘜���,������蝑�,���瑼�歇摮蝑�),��誑false������
chkString������(,)��������葡
*/	
	public boolean checkStringInFirstLine( String path, String chkString )
	{
		if( chkString==null || "".equals(chkString) )
			return false;
			
		path = changeSlopeToRL( path );
		int index = path.lastIndexOf( '/' );
		String dir = path.substring( 0, index );
		String file = path.substring( index+1 );
		File myFile = new File(dir, file);
		
		if( !myFile.exists() )
			return false;
		
		return checkStringInFirstLine( myFile, chkString );				
	}


/**
��:File myFile, String chkString
隤芣��:瑼ＸmyFile��隞�銵其����洵銝�銵������葡(chkString)
��銵仃���(靘�:���瘜���,������蝑�,���瑼�歇摮蝑�),��誑false������
chkString������(,)��������葡
*/	
	public boolean checkStringInFirstLine( File myFile, String chkString )
	{
		if( !myFile.exists() )
			return false;
		
		try
		{
			BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(myFile), "MS950"), 32768);
			String firstLine = in.readLine();
			in.close();			
			
			if( "".equals(chkString.trim()) )
				return true;
			
			if( chkString.indexOf(',')==-1 )
			{
				if( firstLine.indexOf(chkString)!=-1 )
					return true;
				else
					return false;	
			}
			else
			{
				int flag = 0;
				String chkStrings[] = ut.toStringArray( chkString, "," );
				for(int i=0; i<chkStrings.length; i++)
				{
					if( firstLine.indexOf(chkStrings[i])!=-1 )
					{
						flag++;
						break;
					}
				}
				
				if(flag>0)
					return true;
				else
					return false;
			}
		}
		catch(Exception e)
		{
			System.out.println("fileUtil.checkStringInFirstLine error:"+e);
			return false;
		}
					
	}

	
/**
��:String path, String times
隤芣��:瑼Ｘpath�������葉,摰銋葉�瘞�������摰活�(times) 
��銵仃���(靘�:������蝑�),��誑false������
*/	
	public boolean checkChimeseDate( String path, int times )
	{
		if( times==0 )
			return true;
			
		path = changeSlopeToRL( path );
		int index = path.lastIndexOf( '/' );
		String dir = path.substring( 0, index );
		String file = path.substring( index+1 );
		File myFile = new File(dir, file);
		
		if( !myFile.exists() )
			return false;
		
		return checkChimeseDate( myFile, times );				
	}	
	
		
/**
��:String path, String times
隤芣��:瑼Ｘpath�������葉,摰銋葉�瘞�������摰活�(times) 
��銵仃���(靘�:������蝑�),��誑false������
*/	
	public boolean checkChimeseDate( File myFile, int times )
	{
		if( !myFile.exists() )
			return false;		
		try
		{
			int count = 0;
			boolean EOF = false;
			String oneLine = new String();
			BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(myFile), "MS950"), 32768);
			
			while( (oneLine=in.readLine())!=null )
			{
				if( checkOneLineChimeseDate( oneLine ) )
					count++;
			}
			
			//System.out.println("count="+count);
			in.close();
			
			if( count>=times )
				return true;
			else
				return false;			
		}
		catch(Exception e)
		{
			System.out.println("fileUtil.checkChimeseDate error:"+e);
			return false;
		}
					
	}	
	
	
/**
��:String path
隤芣��:瑼Ｘ摮葡���摰銋葉�瘞����(������"銝剛瘞��","撟�","���","�"蝑�葡)
��銵仃���(靘�:������蝑�),��誑false������
*/	
	public boolean checkOneLineChimeseDate( String oneLine )
	{
		try
		{
			oneLine = ut.noAnyBlank( oneLine );
			int titleSet = 0;
			int yearSet = 0;
			int monthSet = 0;
			int daySet = 0;
			
			if( (titleSet=oneLine.indexOf("銝剛瘞��"))!=0 )
				return false;
				
			if( (yearSet=oneLine.indexOf("撟�"))==-1 )
				return false;
				
			if( (monthSet=oneLine.indexOf("���"))==-1 )
				return false;
				
			if( (daySet=oneLine.indexOf("�"))==-1 )
				return false;
			
			if( titleSet<yearSet && yearSet<monthSet && monthSet<daySet )
				return true;	
			else
				return false;
		}
		catch(Exception e)
		{
			System.out.println("fileUtil.checkOneLineChimeseDate error:"+e);
			return false;
		}
	}
	
	
//���"銝剛瘞����僑嚚����"頧"yyymmdd"
	public String convertDate(String line)
	{
		try {
			//ptln("converftDate string =" +line);
			String temps=ut.noAnyBlank(line);
			//ptln(temps);
			String t= "";
			String t1 = "";
			//parse 銝剜�摮�
			if (isChineseNum(line)){
				t=getNumFromChinese( temps.substring( temps.indexOf("���")+1,temps.indexOf("撟�") ) );
				if(t.length()==2)
				{
					t="0"+t;
				}
				//ptln(t);
				t=t+getNumFromChinese( temps.substring( temps.indexOf("撟�")+1,temps.indexOf("���") ) );
				//ptln(t);
				t=t+getNumFromChinese( temps.substring( temps.indexOf("���")+1,temps.indexOf("�") ) );
				//ptln(t);
			}else{
				//parse ���摩�摮�

				t = temps.substring( temps.indexOf("���")+1,temps.indexOf("撟�") );
				t =ut.noAnyBlank(t);
				if(t.length()==2) t="0"+t;

				t1 =temps.substring( temps.indexOf("撟�")+1,temps.indexOf("���") ) ;
				t1 =ut.noAnyBlank(t1);
				if (t1.length()==1) t1 = "0" + t1;
				t=t+t1 ;

				t1 = temps.substring( temps.indexOf("���")+1,temps.indexOf("�") );
				t1 =ut.noAnyBlank(t1);
				if (t1.length()==1) t1 = "0" + t1;
				t=t+ t1;


				//瑼Ｘ��������摩�摮���店嚗�蝛箇
				if (isFullNum(t)){
					t = "";
				}


			}
			//銝雲銝Ⅳ嚗�蝛箇
			if (t.length()!=7){
				t = "";
			}
			return t;

		 }
		catch(Exception e)
		{
			System.out.println("EXCEPTION:convertDate()"+e);
			return "";
		} 

	}

	/**
	 * 瑼Ｘ����葉��摮�
	 * @return boolean ��葉��摮�true , ���摩�摮� false
	 */
	private boolean isChineseNum(String line){
		String[] num = {"銋�","���","銝�","鈭�","銝�","���","鈭�","�","銝�","�"};
		boolean retVal = false;
		for (int i=0;i<num.length;i++){
			if (line.indexOf(num[i])!=-1){
				retVal = true;
				break;
			}
		}
		return retVal;
	}

	//2007.07.24 modified by leiwswang [#1594]
	/**
	 * �摮�1~10���葉����
	 * @return String ��銝剜��
	 */
	public String changeNum(int count){
		String[] num = {"銋�","���","銝�","鈭�","銝�","���","鈭�","�","銝�","�"};
		int[] numcount = {9,10,1,2,3,4,5,6,7,8};
		String retVal = "";
		for (int i=0;i<num.length;i++){
			if (count == numcount[i]){
				retVal = num[i];
				break;
			}
		}
		return retVal;
	}	
	
	//瑼Ｘ�������隡舀摮�
	private boolean isFullNum(String line){
		String[] num = {"嚗�","嚗�","嚗�","嚗�","嚗�","嚗�","嚗�","嚗�","嚗�","嚗�"};
		boolean retVal = false;
		for (int i=0;i<num.length;i++){
			if (line.indexOf(num[i])!=-1){
				retVal = true;
				break;
			}
		}
		return retVal;
	}
	private String getNumFromChinese(String d)
	{
		Hashtable ht=new Hashtable();
		ht.put("銝�","1");
		ht.put("鈭�","2");
		ht.put("銝�","3");
		ht.put("���","4");
		ht.put("鈭�","5");
		ht.put("�","6");
		ht.put("銝�","7");
		ht.put("�","8");
		ht.put("銋�","9");			
					 
		int sum=0;
		String temps="";
		if( d.indexOf("���")!=-1 )
		{
			temps=d.substring(d.indexOf("���")-1,d.indexOf("���"));					
			int ti=Integer.parseInt((String)ht.get(temps))*1000;
			sum=sum+ti;
		}
										                    	
	    	if( d.indexOf("�")!=-1 )
	    	{
			temps=d.substring(d.indexOf("�")-1,d.indexOf("�"));					
			int ti=Integer.parseInt((String)ht.get(temps))*100;
			sum=sum+ti;
		}
		if( d.indexOf("���")!=-1 )
		{
			if(d.indexOf("���")==0)
			{
				sum=sum+10;		
			}
			else 
			{
				temps=d.substring(d.indexOf("���")-1,d.indexOf("���"));					
				int ti=Integer.parseInt((String)ht.get(temps))*10;
				sum=sum+ti;
			}
		}
		
		temps=d.substring(d.length()-1);					
		int ti=0;
		if (ht.get(temps)!=null)
			ti=Integer.parseInt((String)ht.get(temps));
		sum=sum+ti;
		String ts=new String(""+sum);
		if(ts.length()==1)
		{
			ts="0"+ts;
		}
		return ts;
	}	
	



/**
��:String srcString, String chkString
隤芣��:瑼ＸsrcString��隞�銵其��葡�������葡(chkString),����,�������銋�����,
�������葡,chkString������(,)��������葡
*/	
	public String cutSpecialString( String srcString, String chkString )
	{
		if( chkString.indexOf(',')==-1 )
		{
			if( srcString.indexOf(chkString)!=-1 )
				return srcString.substring( 0, srcString.indexOf(chkString) );
		}
		else
		{
			String chkStrings[] = ut.toStringArray( chkString, "," );
			return cutSpecialString( srcString, chkStrings );
		}	
		
		return srcString;	//���府銝�銵
	}

/**
��:String srcString, String chkStrings[]
隤芣��:瑼ＸsrcString��隞�銵其��葡�������葡(chkString),����,�������銋�����,
�������葡,chkString������(,)��������葡
*/	
	public String cutSpecialString( String srcString, String[] chkStrings )
	{
		for(int i=0; i<chkStrings.length; i++)
			if( srcString.indexOf(chkStrings[i])!=-1 )
				return srcString.substring( 0, srcString.indexOf(chkStrings[i]) );		
		return srcString;
	}


/**
��:BufferedReader in, BufferedWriter out, String chkString
隤芣��:瑼Ｘ頛詨瑼��(in)�銝餅���������葡(chkString)��銋�銵偏����,銝西撓�������(out)
��"銝餅��"�摮�,��瑼���甇�,chkString������(,)��������葡
ps:"銝餅��"�摮�撓�,��撘撓���撓�靘��雿輻�銵憭蝣箏��,�撘頨思���������
*/
	public boolean cutSpecialString( BufferedReader in, BufferedWriter out, String chkString )
	{
		String oneLine = "";
		try
		{		
			while( (oneLine=in.readLine())!=null || ut.noAnyBlank( oneLine ).indexOf("銝餅��")==-1 )
			{
				oneLine = cutSpecialString( oneLine, chkString ) ;
				out.write( oneLine, 0, oneLine.length() );
				out.newLine();
				out.flush();
			}
			
			if( oneLine!=null )
			{
				out.write( oneLine, 0, oneLine.length() );
				out.newLine();
				out.flush();
			}
			
			return true;
		}
		catch(Exception e)
		{
			System.out.println("fileUtil.cutSpecialString error:"+e);
			return false;
		}		
	}
	
	/**
	 * 皜征����
	 * @param dir
	 * @param deleDir	��������
	 */
	public void emptyDir(String dir,boolean deleDir){
		File f = new File(dir);
		File[] flist = f.listFiles();
		if (flist!=null){
			for(int i=0;i<flist.length;i++){
				if (flist[i].isFile()){
					flist[i].delete();
				}else{
					emptyDir( flist[i].getAbsolutePath(),deleDir );
					if (deleDir) flist[i].delete();
				}
			}
		}
		flist = null;
	}
	
	/**
	 * 撱箇����
	 * @param dir
	 */
	public void mkdir(String dir){
		File f = new File(dir);
		if (!f.exists()) f.mkdirs();
		f = null;
	}
/**
��:BufferedReader in, BufferedWriter out, String[] chkStrings
隤芣��:瑼Ｘ頛詨瑼��(in)�銝餅���������葡(chkString)��銋�銵偏����,銝西撓�������(out)
��"銝餅��"�摮�,��瑼���甇�,chkString������(,)��������葡
ps:"銝餅��"�摮�撓�,��撘撓���撓�靘��雿輻�銵憭蝣箏��,�撘頨思���������
*/
	public boolean cutSpecialString( BufferedReader in, BufferedWriter out, String[] chkStrings )
	{
		String oneLine = "";
		try
		{
			while( (oneLine=in.readLine())!=null || ut.noAnyBlank( oneLine ).indexOf("銝餅��")==-1 )
			{
				oneLine = cutSpecialString( oneLine, chkStrings ) ;
				out.write( oneLine, 0, oneLine.length() );
				out.newLine();
				out.flush();
			}	
			
			if( oneLine!=null )
			{
				out.write( oneLine, 0, oneLine.length() );
				out.newLine();
				out.flush();
			}
						
			return true;	
		}
		catch(Exception e)
		{
			System.out.println("fileUtil.cutSpecialString error:"+e);
			return false;
		}		
	}

/**
��:BufferedReader in, BufferedWriter out, Vector vr
隤芣��:瑼Ｘ頛詨瑼��(in)�銝餅���������葡(chkString)��銋�銵偏����,銝西撓�������(out)
��"銝餅��"�摮�,��瑼���甇�,chkString������(,)��������葡
ps:"銝餅��"�摮�撓�,��撘撓���撓�靘��雿輻�銵憭蝣箏��,�撘頨思���������
*/
	public boolean cutSpecialString( BufferedReader in, BufferedWriter out, Vector vr )
	{
		String chkString = "";
		for(int i=0; i<vr.size(); i++)
			chkString = chkString + "," + vr.elementAt(i).toString();
		chkString = chkString.substring(1);
		
		return cutSpecialString( in, out, chkString );
	}


/**
 * ���� File[] (������)
 * @param path 
 * @return
 */
public File[] getFiles(String path){
	
	return getFiles(path,true);
}
/**
 * 
 * @param path 頝臬��
 * @param isDir ��������
 * @return
 */
public File[] getFiles(String path,boolean isDir){
	File f = new File(path);
	File[] fs = null;
	if (!isDir)
		fs = f.listFiles(filter);
	else
		fs = f.listFiles();
	
	return fs;
}
/**
 * 
 * @param path 頝臬��
 * @param filter
 * @return File[]
 */
public File[] getFiles(String path,FileFilter filter){
	File f = new File(path);
	File[] fs = null;
	fs = f.listFiles(filter);	
	return fs;
	
}
/**
 * 靘��之撠���(����)
 *@param f File
 */
public void sortByDate(File[] f){
	Arrays.sort(f,compare_date_asc);
}
/**
 * 靘��之撠���(����)
 * @param f File[]
 */
public void sortBySize(File[] f){
	Arrays.sort(f,compare_size_asc);
}
/**
 * 靘��之撠���
 * @param f File
 * @param i DESC:���� , ASC:���� 
 */
public void sortBySize(File[] f,int i){
	if (i==1)
		Arrays.sort(f,compare_size_desc);
	else
		Arrays.sort(f,compare_size_asc);
}
/**
 * 
 * @param f
 * @param i DESC:���� , ASC:���� 
 */
public void sortByDate(File[] f,int i){
	if (i==1)
		Arrays.sort(f,compare_date_desc);
	else
		Arrays.sort(f,compare_date_asc);
}

// 靘����敺耨����餈�����
private Comparator compare_date_asc = new Comparator(){
	public int compare(Object o1, Object o2){
		long n1 = ((File) o1).lastModified();
		long n2 = ((File) o2).lastModified();

		if (n1 > n2) return 1;
		else if (n1 < n2) return -1;
		else return 0;
	}

};

// 靘����敺耨������餈���,
private Comparator compare_date_desc  = new Comparator(){
	public int compare(Object o1, Object o2){
		long n1 = ((File) o1).lastModified();
		long n2 = ((File) o2).lastModified();

		if (n1 < n2) return 1;
		else if (n1 > n2) return -1;
		else return 0;
	}

};


// 靘��撠憭扳���
private Comparator compare_size_asc = new Comparator(){
	public int compare(Object o1, Object o2){
		long n1 = ((File) o1).length();
		long n2 = ((File) o2).length();

		if (n1 > n2) return 1;
		else if (n1 < n2) return -1;
		else return 0;
	}

};

// 靘��憭批撠���
private Comparator compare_size_desc = new Comparator(){
	public int compare(Object o1, Object o2){
		long n1 = ((File) o1).length();
		long n2 = ((File) o2).length();

		if (n1 < n2) return 1;
		else if (n1 > n2) return -1;
		else return 0;
	}

};

public String getFileContent(String filenm) throws IOException {
	return getFileContent(filenm, getFileCharset(filenm));
}

public String getFileContent(String filenm, String code) throws IOException {
	String ret = "";
	BufferedReader fr = new BufferedReader(new InputStreamReader(new FileInputStream(filenm), code));
	BufferedReader br = new BufferedReader(fr);
	while (br.ready()) {
		ret += br.readLine() + "\r\n";
	}
	fr.close();
	return ret;
}


public String getFileCharset(String filenm){ 
	File f = new File(filenm);
    String[] charsetsToBeTested = {"UTF-8", "big5", "windows-1253", "ISO-8859-7"}; 
    CharsetDetector cd = new CharsetDetector();  
    Charset charset = cd.detectCharset(f, charsetsToBeTested);
	return charset!=null ? charset.toString():"";
}



/**
 * �����摰�( txt ,doc, pdf 瑼�霈����)
 * @param filenm
 * @return
 * @throws IOException

public String getFileContent(String filenm) throws IOException {
		 return getFileContent(new File(filenm));	 
}

 */
/**
 * �����摰�( txt ,doc, pdf 瑼�霈����)
 * @param filenm
 * @return
 * @throws IOException

public String getFileContent(File file) throws IOException {
	String  ret ="";
	Reader reader = new Tika().parse(file);
	 if (file.exists()){
		 BufferedReader br = new BufferedReader(reader);
		 try {
		  String line;
		  while ( (line = br.readLine()) != null) {
			  ret += br.readLine() + "\r\n";
		  }
		 } finally {
			 br.close();
		 }
	 }	
	
	return ret;
}
 */
/**
 * �����摰�( txt ,doc, pdf 瑼�霈����)
 * @param file
 * @return BufferedReader
 * @throws IOException

public BufferedReader getFileContentByBufferedReader(File file) throws IOException {
	
	if (file.exists()){
		Reader reader = new Tika().parse(file);
		return new BufferedReader(reader);
	}else{
		return null;
	}

}
 */

	/**
	 * �����摰�( txt ,doc, pdf 瑼�霈����)
	 * 
	 * 
	 *

public BufferedReader getFileContentByBufferedReader(String filenm) throws IOException {
	
	return getFileContentByBufferedReader(new File(filenm));
}

*/

private FileFilter filter = new FileFilter(){
	public boolean accept(File f){
		boolean retVal = true;
		if (f.isDirectory()) retVal = false;
		return retVal;
	}
};

public String getFileName(String filenm) throws Exception {		
	filenm = util.replace(filenm, "/", "\\");		
	if( filenm.indexOf("\\")>-1 )
		return filenm.substring(filenm.lastIndexOf("\\")+1);
	else
		return filenm; 
}

public String getFilePath(String filenm) throws Exception {		
	filenm = util.replace(filenm, "/", "\\");		
	if( filenm.indexOf("\\")>-1 )
		return filenm.substring(0, filenm.lastIndexOf("\\")+1);
	else
		return "";
}

public String getFileExt(String filenm) {
	if( filenm.indexOf(".")>-1 )
		return filenm.substring(filenm.lastIndexOf(".")+1);
	else
		return "";
}

public void setFileContent(String filenm, String data) throws Exception {	
	
	util_File _F = new util_File(); 
	_F.delete(filenm);
	try {		
		_F.open(filenm,"w");
        _F.writeln(data);
   } catch(Exception e){
	   e.printStackTrace();
   } finally {
       _F.close();
   }
	
}

public List getZipFileContentList(String zipfile) {
	return getZipFileContentList(zipfile, "*");
}

public List getZipFileContentList(String zipfile, String listext) {
	List ls = new ArrayList();
	if( this.getFileExt(zipfile).toLowerCase().equals("zip") ) {
		
		ZipUtil zu = new ZipUtil();
		try {
			if (zu.loadZip(zipfile)){
				//Enumeration zu.
				Enumeration e = zu.getEntries();
				while (e.hasMoreElements() ){
					ZipEntry z = (ZipEntry)e.nextElement();
					//銝頝臬�����
					if (!z.isDirectory()){
						if( listext.equals("*") || this.getFileExt(z.getName()).toLowerCase().equals(listext.toLowerCase()) ) {
							HashMap data = new HashMap();
							data.put("pgnm", z.getName());
							data.put("pgsize", z.getSize());
							data.put("pgdt", ud.getCDate(z.getTime()));
							ls.add(data);
						}
					}	
				}					
			}				
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			zu.closeZip();
		}
		
	}
	return ls;
}

public String unZipToTempDir(String zipfile) {
	String tempDir = com.sertek.sys.Project.getTempRandomDir();
	deleteDir(tempDir);
	if( this.getFileExt(zipfile).toLowerCase().equals("zip") ) {
		Unzip uz = new Unzip(true);
		uz.UnzipFrom(zipfile);	
		uz.UnzipTo(tempDir);
		uz.write();
	}
	return tempDir;
}



public void deleteDir(String dir){
	File f = new File(dir);
	File[] flist = f.listFiles();
	if (flist!=null){
		for(int i=0;i<flist.length;i++){
			if (flist[i].isFile()){
				flist[i].delete();
			}else{
				deleteDir( flist[i].getAbsolutePath() );
				flist[i].delete();
			}
		}
	}
	flist = null;
}

public void deleteDir(String dir,boolean deleDir){
	File f = new File(dir);
	File[] flist = f.listFiles();
	if (flist!=null){
		for(int i=0;i<flist.length;i++){
			if (flist[i].isFile()){
				flist[i].delete();
			}else{
				deleteDir( flist[i].getAbsolutePath(),deleDir );
				if (deleDir) flist[i].delete();
			}
		}
	}
	flist = null;
}

public Boolean checkImageFileType(String fileName){
	String imageFileTypes = ".png .gif .jpg .gif .swf .PNG .GIF .JPG .GIF .SWF";
	if( fileName.indexOf(".")>-1 )
		fileName = fileName.substring(fileName.lastIndexOf(".")+1);
	
	if (imageFileTypes.indexOf(fileName) != -1)
		return true;
	else
		return false;
}

public String imageToBase64(String filePath) throws Exception{
	String base64Code = "";
	if(StringUtils.isNotBlank(filePath)){
		
		BufferedImage img = ImageIO.read(new File(filePath));
        ByteArrayOutputStream bos = new ByteArrayOutputStream();

        ImageIO.write(img, "jpg", bos);
        byte[] imageBytes = bos.toByteArray();
        bos.close();

        // 撠yte�銵楊蝣�
        BASE64Encoder encoder = new BASE64Encoder();
	    base64Code = encoder.encode(imageBytes);
	}
	return base64Code;
}


public boolean createFile(String file) throws IOException {
	// TODO Auto-generated method stub
	File dir_file = new File(file);	  /*一樣輸入路徑跟想建立的檔名還有類型*/
    return dir_file.createNewFile();	
}

public void writeFile(String file, String txt) throws IOException {
	util_File uf1 = new util_File(file, "wa");
	uf1.write(txt);
	uf1.close();	
}

}
