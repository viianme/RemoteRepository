package com.cpl.json;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

public class DemoGSON_withUnknowClass {

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
		JsonObject jsonObject = gson.fromJson(json, JsonObject.class);
		String isbn = jsonObject.get("isbn").getAsString();
		String name = jsonObject.get("name").getAsString();
		int price = jsonObject.get("price").getAsInt();
		new Book(isbn,name,price).show();;
	}
}
