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
 * Jakarta POI �O�@�M�Ω�X�ݷL�n�榡���Java API�C <br/>
 * Jakarta POI���ܦh����զ��A�䤤���Ω�ާ@Excel�榡�ɮת�HSSF�M�Ω�ާ@Word��HWPF�A
 * �b�U�ؤ��󤤥ثe�u���Ω�ާ@Excel��HSSF�۹令���C<br/>
 * �x��D��http://poi.apache.org/index.html API���<br/>
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
	 * ���o�@��Excel�ɮ� <br/>
	 * �פJExcel��
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
	 * �إߤ@��Excel�ɮ� �ץXExcel��
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
	 * �إߤ@�Ӥu�@���e
	 * 
	 * @throws Exception
	 */
	public void createSheet(Workbook workbook, String sheetName, List<ExcelColumnBean> columnList,
			List<HashMap> dataList) throws Exception {
		Sheet sheet = workbook.createSheet(sheetName);

		// �]�w�椸��榡�~��
		CellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);

		// �s�W���Y���e
		setHeadCell(sheet, columnList, cellStyle);

		// �s�W��Ƥ��e
		setDataCell(sheet, columnList, dataList, cellStyle);

	}

	
	
	/** �ץXExcel�ɮ� */
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
	 * �s�W���Y���e
	 * 
	 * @throws Exception
	 */
	private void setHeadCell(Sheet sheet, List<ExcelColumnBean> columnList, CellStyle cellStyle) throws Exception {

		if (CheckUtils.checkListNull(columnList)) {
			throw new Exception("�г]�w���Y���e");
		}

		Row hssfRow = sheet.createRow(0); // �s�W���Y��
		for (ExcelColumnBean coulum : columnList) {
			Cell headCell = hssfRow.createCell(coulum.getXloc());
			headCell.setCellValue(coulum.getTitle());
			headCell.setCellStyle(cellStyle);
		}
	}
	
	

	/** �s�W��Ƥ��e */
	private void setDataCell(Sheet sheet, List<ExcelColumnBean> columnList, List<HashMap> dataList,
			CellStyle cellStyle) {
		for (int i = 0; i < dataList.size(); i++) {
			Row hssfRow = sheet.createRow((int) i + 1);
			HashMap student = dataList.get(i);
			// �إ߳椸��A�ó]�w��

			for (ExcelColumnBean coulum : columnList) {
				Cell cell = hssfRow.createCell(coulum.getXloc());
				cell.setCellValue(MapUtils.getString(student, coulum.getField()));
				cell.setCellStyle(cellStyle);
			}
		}
	}
	
	
	/** 
	 * �w�]���Ĥ@�isheet��Title
	 */
	public List<String> getTitleList(Workbook workbook){
		return getTitleList(workbook, 0, 0);
	}
	

	/**
	 * ���o��N�isheet��Title
	 * 
	 * @param sheetIndex ��N�isheet index�q0�}�l
	 */
	public List<String> getTitleList(Workbook workbook, int sheetIndex, int titleRow){
		List<String> list = new ArrayList<String>();
		
		Sheet sheet = workbook.getSheetAt(sheetIndex); // ���oExcel�Ĥ@��sheet(�q0�}�l)
		Cell cell;

		Row row = sheet.getRow(titleRow); // ���o�� i Row
		if (row != null) {
			for (int j = 0; j < row.getLastCellNum(); j++) { // �ݸ�ƻݭn�����
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
	 * �ѪRExcel
	 * �ץX��1�iExcel�����
	 * @param titleRow   title�_�lrow  index�q0�}�l
	 * @return List<HashMap>
	 */
	public List<HashMap> parse(Workbook workbook, int titleRow) {
		return parseBySheet(workbook, 0, titleRow);
	}
	
	
	public List<HashMap> parseBySheet(Workbook workbook, int sheetIndex) {
		return parseBySheet(workbook, sheetIndex, 0);
	}
	
	
	
	/**
	 * �ѪRExcel
	 * �ץX��N�iExcel�����
	 * @param sheetIndex ��N�isheet    index�q0�}�l
	 * @param titleRow   title�_�lrow  index�q0�}�l
	 * @return List<HashMap>
	 */
	public List<HashMap> parseBySheet(Workbook workbook, int sheetIndex, int titleRow) {
		List<HashMap> data = new ArrayList<HashMap>();
		
		try {
			List<String> headerList = getTitleList(workbook, sheetIndex, titleRow);
			Sheet sheet = workbook.getSheetAt(sheetIndex); // ���oExcel�Ĥ@��sheet(�q0�}�l)
			
			System.out.println("�@��:"+(sheet.getPhysicalNumberOfRows()-1)+"�C���");
			for (int i = titleRow+1; i < sheet.getPhysicalNumberOfRows(); i++) {
				// �ѩ�� 0 Row �� title, �G i �q 1 �}�l
				Row row = sheet.getRow(i); // ���o�� i Row
				if (row != null) {
					HashMap map = new HashMap();
					for (int j = 0; j < row.getLastCellNum(); j++) { // �ݸ�ƻݭn�����
						map.put(headerList.get(j), row.getCell(j)); // ���Xj�Cj�檺��
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
