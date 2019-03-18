package com.cpl.utils;

import java.util.Objects;

public class Interval {

	private String startDate = "";
	private String endDate = "";
	
	public Interval(){
		
	}
	
	public Interval(String startDate,String endDate){
		this.startDate = startDate;
		this.endDate = endDate;
	}
	
	public Interval(int startDate,int endDate){
		this.startDate= String.valueOf(startDate);
		this.endDate  = String.valueOf(endDate);
	}
	
	public String getDateInterval() {
		return startDate+"-"+endDate;
	}
	
	public void setDateInterval(String startDate,String endDate){
		this.startDate = startDate;
		this.endDate = endDate;
	}
	
	public String getStart() {
		return startDate;
	}

	public void setStart(String startDate) {
		this.startDate = startDate;
	}

	public String getEnd() {
		return endDate;
	}

	public void setEnd(String endDate) {
		this.endDate = endDate;
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
	
	@Override
    public int hashCode() {
        // Objects 有 hash() 方法可以使用
        // 以下可以簡化為 return Objects.hash(name, number);
        int hash = 7;
        hash = 47 * hash + Objects.hashCode(this.startDate);
        hash = 47 * hash + Objects.hashCode(this.endDate);
//        hash = 47 * hash + this.startDate.hashCode();
//        hash = 47 * hash + this.endDate.hashCode();
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final Interval other = (Interval) obj;
        if (!Objects.equals(this.startDate, other.startDate)) {
//        if (!this.startDate.equals(other.startDate)) {
            return false;
        }
        if (!Objects.equals(this.endDate, other.endDate)) {
//        if (!this.endDate.equals(other.endDate)) {
            return false;
        }
        return true;
    }


}
