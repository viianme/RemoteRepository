package com.cpl.json;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

public class DemoGSON {

	public static void main(String[] args) {
		// ======= Object to JSON =======
		// 建立Book物件
		Book book = new Book("956-987236-1", "Java歷險記", 550);
		// 建立GSON物件
		Gson gson = new Gson();
		// 將Book物件轉成JSON
		String json = gson.toJson(book);
		// 把JSON格式的資料秀出來
		System.out.println("Object to JSON:"+ json);
		// 輸出結果：{"isbn":"956-987236-1","name":"Java歷險記","price":550}
		// ======== JSON to Object ========
		// 將JSON格式的資料轉成物件
		Book jbook = gson.fromJson(json, Book.class);
//		System.out.println(jbook.getIsbn());
//		System.out.println(jbook.getName());
//		System.out.println(jbook.getPrice());
		jbook.show();

//		JsonObject object = gson.fromJson(json, JsonObject.class);
//		System.out.println(object.get("isbn").getAsString());
//		System.out.println(object.get("name").getAsString());
//		System.out.println(object.get("price").getAsString());

	}
}
