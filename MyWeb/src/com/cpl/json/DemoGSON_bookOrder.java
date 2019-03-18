package com.cpl.json;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import net.sf.json.JSONObject;

public class DemoGSON_bookOrder {

	public static void main(String[] args) {
		List<Book> bookList = new ArrayList<Book>();
		bookList.add(new Book("956-987236-1", "Java歷險記", 550));
		bookList.add(new Book("956-987236-2", "Python歷險記", 499));
		
		Order order = new Order("111", "ron", new Date(), bookList);
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		String jsonStr = gson.toJson(order);
		
		// Object (with List) to JSON
		System.out.println("Object (with List) to JSON: " + jsonStr);
		
		// JSON to Object (with List)
		Order myOrder = gson.fromJson(jsonStr, Order.class);
		myOrder.show();
	}

}
