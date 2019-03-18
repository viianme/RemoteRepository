package com.cpl.json;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

public class Book {
	private String isbn;
	private String name;
	private int price;

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public Book(String _isbn, String _name, int _price) {
		isbn = _isbn;
		name = _name;
		price = _price;
	}
	
	public void show(){
		System.out.println("isbn:[" + isbn + "]; name=[" + name+ "]; price=[" + price +"]");
	}
	
}
