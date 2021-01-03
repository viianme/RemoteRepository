package com.cpl.sort;

public class SelectionSort {

	public static void main(String[] args) {
		
		int[] nums = {5, 2, 10, 16};
		
		for(int i=0 ,minIndex ; i<nums.length; i++){
			for(int j=i+1; j<nums.length; j++){
				minIndex = i;
				if(nums[j] < nums[minIndex]){
					
					minIndex = j;
				}
				if (minIndex != i){
					//���index����
					int tmp = nums[minIndex];
					nums[minIndex] = nums[i];
					nums[i] = tmp;
				}
			}
			
		}
		for(int n: nums) {
			System.out.println(n);
		}

		
		
		//���o�Y�ɶײv
//		try{
//			String urlConnect = "http://data.fixer.io/api/latest?access_key=b8f366a953e4d1440762f092925296c3";
//			URL url = new URL(urlConnect);
//			HttpURLConnection conn = (HttpURLConnection)url.openConnection();
//			InputStreamReader isr = new InputStreamReader(conn.getInputStream());
//			BufferedReader in = new BufferedReader(isr);
//			String line = in.readLine();
//			System.out.println(line);
//			
//			in.close();
//		}catch(Exception e){
//			System.out.println(e.getMessage());
//		}finally{
//			
//		}
		
	}

}
