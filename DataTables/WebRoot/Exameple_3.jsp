<%@ page language="java" contentType="text/html; charset=BIG5"
    pageEncoding="BIG5"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=BIG5">
<title>DataTable Example3</title>

<!-- jQuery.js -->
<script src="/DataTables/resource/js/jquery-3.3.1.min.js"></script>
<script src="/DataTables/resource/js/jquery-ui.min.js"></script>

<!-- DataTables.js -->
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>

<script>
	$(document).ready(function(){
		//Ajax sourced data
		 $('#example').DataTable( {
			    "ajax": '/DataTables/resource/ajax/data/arrays.txt',
		        "columns":[
		        	{title : "Name"},
		        	{title : "Position"},
		        	{title : "Office"},
		        	{title : "Extn."},
		        	{title : "Start date"},
		        	{title : "Salary"}
		        ]
		 } );
	});
</script>

</head>

<body>

<table id="example" class="display" style="width:100%"></table>
</body>
</html>