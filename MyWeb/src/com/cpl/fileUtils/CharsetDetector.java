package com.cpl.fileUtils;

import java.io.BufferedInputStream;  
import java.io.File;  
import java.io.FileInputStream;  
import java.io.FileNotFoundException;  
import java.io.IOException;  
import java.io.InputStreamReader;  
import java.nio.ByteBuffer;  
import java.nio.charset.CharacterCodingException;  
import java.nio.charset.Charset;  
import java.nio.charset.CharsetDecoder;  
  
public class CharsetDetector {  
    public Charset detectCharset(File f, String[] charsets) {  
  
        Charset charset = null;  
  
        // charsets 是我們定義的 編碼 矩陣, 包括 UTF8, BIG5 etc.  
        for (String charsetName : charsets) {  
            charset = detectCharset(f, Charset.forName(charsetName));  
            if (charset != null) {  
                break;  
            }  
        }    
        return charset;  
    }  
  
    private Charset detectCharset(File f, Charset charset) {  
        try {  
            BufferedInputStream input = new BufferedInputStream(new FileInputStream(f));  
  
            CharsetDecoder decoder = charset.newDecoder();  
            decoder.reset();  
  
            byte[] buffer = new byte[512];  
            boolean identified = false;  
            while ((input.read(buffer) != -1) && (!identified)) {  
                identified = identify(buffer, decoder);  
            }  
  
            input.close();  
  
            if (identified) {  
                return charset;  
            } else {  
                return null;  
            }  
  
        } catch (Exception e) {  
            return null;  
        }  
    }  
  
    private boolean identify(byte[] bytes, CharsetDecoder decoder) {  
        try {  
            decoder.decode(ByteBuffer.wrap(bytes));  
        } catch (CharacterCodingException e) {  
            return false;  
        }  
        return true;  
    }  
}  