package com.cpl.json;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Order {
	private String orderId;
	private String customer;
	private Date date;
	private List<Book> bookList;
 
	public Order() {
		super();
	}
 
	public Order(String orderId, String customer, Date date, List<Book> bookList) {
		super();
		this.orderId = orderId;
		this.customer = customer;
		this.date = date;
		this.bookList = bookList;
	}
 
	public String getOrderId() {
		return orderId;
	}
 
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
 
	public String getCustomer() {
		return customer;
	}
 
	public void setCustomer(String customer) {
		this.customer = customer;
	}
 
	public Date getDate() {
		return date;
	}
 
	public void setDate(Date date) {
		this.date = date;
	}
 
	public List<Book> getBookList() {
		return bookList;
	}
 
	public void setBookList(ArrayList<Book> bookList) {
		this.bookList = bookList;
	}
 
	public void show() {
		System.out.println("Order information:");
		System.out.println("orderId=[" + orderId + "]; customer=[" + customer+ "]; date=[" + date +"]");
		System.out.println("Details: ");
		for (Book book : bookList) {
			book.show();
		}
	}
}
