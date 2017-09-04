<% var step = 1; %>
<form class="container" id="videos-new">
	<div class="body">
		<h2>New Video</h2>
		<div class="help">
			<span class="step"><%=step++%></span>
			Choose Attributes
		</div>

		<table class="attributes">
			<tbody>
				<% _.each(Attributes, function(attr) { %>
				<tr>
					<th><%-attr.name%></th>
					<td><%=attr.html%></td>
				</tr>
				<% }) %>
			</tbody>
		</table>
		<div class="help">
			<span class="step"><%=step++%></span>
			Enter Video Details
		</div>
		<div style="float:right; width: 200px">
			<strong>Hint</strong>: You can find the Video ID in the address bar:
			<img src="/assets/img/youtube-id.png" style="margin-top: 5px">
		</div>
		<table>
			<tbody>
				<tr>
					<th>Type</th>
					<td>
						<%=mkSelect("Type", {
							"Demonstration": "Demonstration", 
							"Tutorial": "Tutorial", 
							"Performance": "Performance"
						}, "Demonstration")%>
					</td>
				</tr>
				<tr>
					<th>Video ID</th>
					<td>
						<input name="VideoId" type="text">
					</td>
				</tr>
				<tr>
					<th>Start <small>(optional)</small></th>
					<td>
						<input name="Start" type="text"> seconds
					</td>
				</tr>
				<tr>
					<th>End <small>(optional)</small></th>
					<td>
						<input name="End" type="text"> seconds
					</td>
				</tr>
			</tbody>
		</table>
		<!--
		<div id="widget" style="display: none"></div>
		-->

		<div class="help">
			<span class="step"><%=step++%></span>
			Submit for Review
		</div>

		<div class="buttons">
			<button class="btn btn-large cancel">Cancel</button>
			<button class="btn btn-large btn-primary submit">Submit</button>
		</div>
	</div>
</form>
