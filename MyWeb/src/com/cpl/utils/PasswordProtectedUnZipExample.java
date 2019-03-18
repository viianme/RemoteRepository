package com.cpl.utils;

import com.cpl.zipUtils.Unzip;

public class PasswordProtectedUnZipExample {

	public static void main(String[] args) {
		 String zipFile = "C:/test/test.zip";
		 String path    = "C:/test";
		 Unzip z = new Unzip();
		 z.Decrypter("howtodoinjava");
		 z.setUnzipPath(zipFile, path);
		 z.writeZip();

	}

}
