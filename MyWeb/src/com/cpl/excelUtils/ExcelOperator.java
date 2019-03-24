package com.cpl.excelUtils;

import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.collections.MapUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.cpl.utils.CheckUtils;

/**
 * Jakarta POI �O�@�M�Ω�X�ݷL�n�榡���Java API�C 
 * Jakarta POI���ܦh����զ��A�䤤���Ω�ާ@Excel�榡�ɮת�HSSF�M�Ω�ާ@Word��HWPF�A �b�U�ؤ��󤤥ثe�u���Ω�ާ@Excel��HSSF�۹令���C
 * �x��D��http://poi.apache.org/index.html API���
 * http://poi.apache.org/apidocs/index.html
 * 
 * poi-3.15.jar
 */

public class ExcelOperator {

	/**�إߤ@��Excel�ɮ�*/
	public HSSFWorkbook createExcel(){
		return new HSSFWorkbook();
	}
	
	
	/** �إߤ@�Ӥu�@���e
	 * @throws Exception */
	public void createSheet(HSSFWorkbook workbook, String sheetName, List<ExcelColumnBean> columnList, List<HashMap> dataList) throws Exception{
		HSSFSheet sheet = workbook.createSheet(sheetName);
		
		// �]�w�椸��榡�~��
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);

		//�s�W���Y���e
		setHeadCell(sheet, columnList, cellStyle);
		
		//�s�W��Ƥ��e
		setDataCell(sheet, columnList, dataList, cellStyle);

	}


	/** �ץXExcel�ɮ�*/
	public void export(HSSFWorkbook workbook, String path) {
		try {
			OutputStream outputStream = new FileOutputStream(path);
			workbook.write(outputStream);
			outputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	/**�s�W���Y���e
	 * @throws Exception */
	private void setHeadCell(HSSFSheet sheet, List<ExcelColumnBean> columnList, HSSFCellStyle cellStyle) throws Exception {	
		
		if( CheckUtils.checkListNull(columnList) ) {
			throw new Exception("�г]�w���Y���e");
		}
		
		HSSFRow hssfRow = sheet.createRow(0);  // �s�W���Y��
		for(ExcelColumnBean coulum : columnList){
			HSSFCell headCell = hssfRow.createCell(coulum.getXloc());
			headCell.setCellValue(coulum.getTitle());
			headCell.setCellStyle(cellStyle);
		}
	}
	
	
	/**�s�W��Ƥ��e*/
	private void setDataCell(HSSFSheet sheet, List<ExcelColumnBean> columnList,  List<HashMap> dataList, HSSFCellStyle cellStyle) {
		for (int i = 0; i < dataList.size(); i++  ) {
			HSSFRow hssfRow = sheet.createRow((int) i +  1);
			HashMap student = dataList.get(i);
			// �إ߳椸��A�ó]�w��
			
			for(ExcelColumnBean coulum : columnList){
				HSSFCell cell = hssfRow.createCell(coulum.getXloc());
				cell.setCellValue(MapUtils.getString(student, coulum.getField()));
				cell.setCellStyle(cellStyle);
			}
		}
	}
	
	
}
