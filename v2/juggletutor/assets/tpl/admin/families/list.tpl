<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Attributes</th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<td colspan="3">
				<a href="/admin/families/new">Add</a>
			</td>
		</tr>
	</tfoot>
	<tbody>
	<% _.each(Families, function(family, i) { %>
		<tr>
			<td><a href="/admin/families/<%-i+1%>/edit"><%-family.Name%></a></td>
			<td><%=family.Attributes%></td>
		</tr>
	<% }) %>
	</tbody>
</table>
