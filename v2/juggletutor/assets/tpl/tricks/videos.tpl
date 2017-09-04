<% _.each(Videos, function(video, i) { %>
  <% if (i > 0 && i % 3 == 0) { %><br style="clear: both"><% } %>
  <iframe type="text/html"
    width="352" height="218" frameborder="0"
    style="float: left; margin-right: 20px"
    src="http://www.youtube.com/embed/<%-video.VideoId%>?modestbranding=1&showinfo=0&rel=0" />
<% }) %>
<br style="clear: both">