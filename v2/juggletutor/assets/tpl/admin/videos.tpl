<div class="container" id="admin-videos">
  <div class="body">
    <h2>Videos</h2>
    <% _.each(Videos, function(video) { %>
    <form class="video clearfix">
      <input type="hidden" name="Id" value="<%=video.Id%>">
      <iframe width="260" height="200" src="//www.youtube-nocookie.com/embed/<%-video.VideoId%>?rel=0" frameborder="0" allowfullscreen style="float:left; margin-right: 5px;"></iframe>
      <div style="float:right; width:200px">
        <div class="buttons">
          <textarea name="StatusDescription" rows="5" style="margin-bottom: 10px;" placeholder="Comments"></textarea>
          <button class="btn btn-medium reject">Reject</button>
          <button class="btn btn-medium btn-primary approve">Approve</button>
        </div>
      </div>
      <table>
        <tr>
          <th>Type</th>
          <td><%=video.Type%></td>
        </tr>
        <% _.each(video.Attributes, function(val, name) { %>
        <tr>
          <th><%=name%></th>
          <td><%=val%></td>
        </tr>
        <% }) %>
      </table>
    </form>
    <% }) %>
  </div>
  </div>
</div>