package com.cpl.excelUtils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.collections.MapUtils;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.cpl.utils.CheckUtils;

/**
 * Jakarta POI 是一套用於訪問微軟格式文件的Java API。 <br/>
 * Jakarta POI有很多元件組成，其中有用於操作Excel格式檔案的HSSF和用於操作Word的HWPF，
 * 在各種元件中目前只有用於操作Excel的HSSF相對成熟。<br/>
 * 官方主頁http://poi.apache.org/index.html API文件<br/>
 * http://poi.apache.org/apidocs/index.html<br/>
 * 
 * poi-3.15.jar <br/>
 * commons-collections4-4.3.jar <br/>
 * poi-excelant-3.15.jar <br/>
 * poi-ooxml-3.15.jar <br/>
 * poi-ooxml-schemas-3.15.0.jar <br/>
 * poi-scratchpad-3.15.jar <br/>
 * dom4j-1.6.1.jar <br/>
 * stax-api-1.0.1.jar <br/>
 * xmlbeans-2.3.0.jar <br/>
 */

public class ExcelOperator {

	private static final String EXCEL_XLS = "xls";
	private static final String EXCEL_XLSX = "xlsx";
	private File file;
	private InputStream in;

	
	
	/**
	 * 取得一個Excel檔案 <br/>
	 * 匯入Excel用
	 */
	public Workbook getWorkbook(File file) throws IOException {
		Workbook wb = null;
		in = new FileInputStream(file);

		if (file.getName().endsWith(EXCEL_XLS)) { // Excel 2003
			wb = new HSSFWorkbook(new BufferedInputStream(in));
			System.out.println("Excel file type:xls");
		} else if (file.getName().endsWith(EXCEL_XLSX)) { // Excel 2007/2010
			wb = new XSSFWorkbook(new BufferedInputStream(in));
			System.out.println("Excel file type:xlsx");
		}
		return wb;
	}

	
	

	/**
	 * 建立一個Excel檔案 匯出Excel用
	 */
	public Workbook createWorkbook(File file) {
		Workbook wb = null;
		this.file = file;
		if (file.getName().endsWith(EXCEL_XLS)) { // Excel 2003
			wb = new HSSFWorkbook();
			System.out.println("Excel file type:xls");
		} else if (file.getName().endsWith(EXCEL_XLSX)) { // Excel 2007/2010
			wb = new XSSFWorkbook();
			System.out.println("Excel file type:xlsx");
		}
		return wb;
	}

	
	
	/**
	 * 建立一個工作表內容
	 * 
	 * @throws Exception
	 */
	public void createSheet(Workbook workbook, String sheetName, List<ExcelColumnBean> columnList,
			List<HashMap> dataList) throws Exception {
		Sheet sheet = workbook.createSheet(sheetName);

		// 設定單元格格式居中
		CellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);

		// 新增表頭內容
		setHeadCell(sheet, columnList, cellStyle);

		// 新增資料內容
		setDataCell(sheet, columnList, dataList, cellStyle);

	}

	
	
	/** 匯出Excel檔案 */
	public void export(Workbook workbook) {
		OutputStream outputStream = null;
		try {
			outputStream = new FileOutputStream(file);
			workbook.write(outputStream);
			System.out.println("Data written successfully");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (outputStream != null) {
					outputStream.flush();
					outputStream.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	

	/**
	 * 新增表頭內容
	 * 
	 * @throws Exception
	 */
	private void setHeadCell(Sheet sheet, List<ExcelColumnBean> columnList, CellStyle cellStyle) throws Exception {

		if (CheckUtils.checkListNull(columnList)) {
			throw new Exception("請設定表頭內容");
		}

		Row hssfRow = sheet.createRow(0); // 新增表頭行
		for (ExcelColumnBean coulum : columnList) {
			Cell headCell = hssfRow.createCell(coulum.getXloc());
			headCell.setCellValue(coulum.getTitle());
			headCell.setCellStyle(cellStyle);
		}
	}
	
	

	/** 新增資料內容 */
	private void setDataCell(Sheet sheet, List<ExcelColumnBean> columnList, List<HashMap> dataList,
			CellStyle cellStyle) {
		for (int i = 0; i < dataList.size(); i++) {
			Row hssfRow = sheet.createRow((int) i + 1);
			HashMap student = dataList.get(i);
			// 建立單元格，並設定值

			for (ExcelColumnBean coulum : columnList) {
				Cell cell = hssfRow.createCell(coulum.getXloc());
				cell.setCellValue(MapUtils.getString(student, coulum.getField()));
				cell.setCellStyle(cellStyle);
			}
		}
	}
	
	
	/** 
	 * 預設取第一張sheet的Title
	 */
	public List<String> getTitleList(Workbook workbook){
		return getTitleList(workbook, 0, 0);
	}
	

	/**
	 * 取得第N張sheet的Title
	 * 
	 * @param sheetIndex 第N張sheet index從0開始
	 */
	public List<String> getTitleList(Workbook workbook, int sheetIndex, int titleRow){
		List<String> list = new ArrayList<String>();
		
		Sheet sheet = workbook.getSheetAt(sheetIndex); // 取得Excel第一個sheet(從0開始)
		Cell cell;

		Row row = sheet.getRow(titleRow); // 取得第 i Row
		if (row != null) {
			for (int j = 0; j < row.getLastCellNum(); j++) { // 看資料需要的欄數
				cell = row.getCell(j);
				list.add(cell.toString());
			}
		}
		System.out.println("getTitleList:"+list);
		return list;
	}
	
	
	
	
	public List<HashMap> parse(Workbook workbook) {
		return parseBySheet(workbook, 0, 0);
	}
	
	
	/**
	 * 解析Excel
	 * 匯出第1張Excel的資料
	 * @param titleRow   title起始row  index從0開始
	 * @return List<HashMap>
	 */
	public List<HashMap> parse(Workbook workbook, int titleRow) {
		return parseBySheet(workbook, 0, titleRow);
	}
	
	
	public List<HashMap> parseBySheet(Workbook workbook, int sheetIndex) {
		return parseBySheet(workbook, sheetIndex, 0);
	}
	
	
	
	/**
	 * 解析Excel
	 * 匯出第N張Excel的資料
	 * @param sheetIndex 第N張sheet    index從0開始
	 * @param titleRow   title起始row  index從0開始
	 * @return List<HashMap>
	 */
	public List<HashMap> parseBySheet(Workbook workbook, int sheetIndex, int titleRow) {
		List<HashMap> data = new ArrayList<HashMap>();
		
		try {
			List<String> headerList = getTitleList(workbook, sheetIndex, titleRow);
			Sheet sheet = workbook.getSheetAt(sheetIndex); // 取得Excel第一個sheet(從0開始)
			
			System.out.println("共有:"+(sheet.getPhysicalNumberOfRows()-1)+"列資料");
			for (int i = titleRow+1; i < sheet.getPhysicalNumberOfRows(); i++) {
				// 由於第 0 Row 為 title, 故 i 從 1 開始
				Row row = sheet.getRow(i); // 取得第 i Row
				if (row != null) {
					HashMap map = new HashMap();
					for (int j = 0; j < row.getLastCellNum(); j++) { // 看資料需要的欄數
						map.put(headerList.get(j), row.getCell(j)); // 取出j列j行的值
					}
					data.add(map);
				}
			}	
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			close();
		}
		return data;
	}
	
	
	
	private void close(){
		try {
			if(in != null) {
				in.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
