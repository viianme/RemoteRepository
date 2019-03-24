package com.cpl.excelUtils;

public class ExcelColumnBean {
	
	private int xloc;
	private String field;
	private String title;

	public ExcelColumnBean() {
		this.xloc = 0;
		this.field = "";
		this.title = "";
	}

	public ExcelColumnBean(String field, String title, int xloc) {
		this.xloc = xloc;
		this.field = field;
		this.title = title;
	}

	public ExcelColumnBean(String field, int xloc) {
		this.xloc = xloc;
		this.field = field;
	}
	
	public int getXloc() {
		return xloc;
	}
	public void setXloc(int xloc) {
		this.xloc = xloc;
	}
	public String getField() {
		return field;
	}
	public void setField(String field) {
		this.field = field;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	
	
	
}
