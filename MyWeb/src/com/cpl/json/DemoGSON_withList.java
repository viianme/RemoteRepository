package com.cpl.json;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class DemoGSON_withList {

	public static void main(String[] args) {
		List<Book> booklist = new ArrayList<Book>();
		booklist.add(new Book("956-987236-1", "Java歷險記", 550));
		booklist.add(new Book("956-987236-2", "Python歷險記", 499));
		
		Gson gson = new Gson();
		String jsonStr = gson.toJson(booklist);
		System.out.println("List to JSON: " + jsonStr);
		
		// JSON to List
		System.out.println("JSON to List: ");
		
		/*
		 * TypeToken represents a generic type. TypeToken is an abstract class
		 * but with no abstract methods, thus we don't have to override any
		 * method in TypeToken.
		 */
		Type collectionType = new TypeToken<List<Book>>() {}.getType();
		List<Book> myBookList = gson.fromJson(jsonStr, collectionType);
		for (Book book : myBookList) {
			book.show();
		}

	}
}
