#include "rpc.hpp"

const char *kIdString = "id";
const char *kMethodString = "method";
const char *kParamsString = "params";

const char *kInvalidIdError = "expected id";
const char *kInvalidMethodError = "expected method";
const char *kInvalidParamsError = "expected params";
const char *kUnknownMethodError = "unknown method";

RPC::RPC(pp::Instance *instance)
{
  instance_ = instance;
  factory_.Initialize(this);
  messageLoop_ = new pp::MessageLoop(instance);
  thread_ = std::thread([this] {
    int32_t status = messageLoop_->AttachToCurrentThread();
    if (status != PP_OK)
    {
      return;
    }
    messageLoop_->Run();
  });
}
RPC::~RPC()
{
  int32_t status = messageLoop_->PostQuit(true);
  if (status == PP_OK)
  {
    thread_.join();
  }
}

void setError(pp::VarDictionary &result, const std::string message)
{
  result.Set("result", pp::Var::Null());
  result.Set("error", message);
}

// result - The Object that was returned by the invoked method. This must be null in case there was an error invoking the method.
// error - An Error object if there was an error invoking the method. It must be null if there was no error.
// id - This must be the same id as the request it is responding to.

void RPC::Handle(const pp::VarDictionary &request)
{
  auto ccb = factory_.NewCallback(&RPC::handle, request);
  messageLoop_->PostWork(ccb);
}
void RPC::handle(int32_t ccb_result, const pp::VarDictionary &request)
{
  pp::VarDictionary result;
  if (!request.HasKey(kIdString))
  {
    setError(result, kInvalidIdError);
    instance_->PostMessage(result);
    return;
  }
  pp::Var id = request.Get(kIdString);
  result.Set(kIdString, id);
  if (!request.HasKey(kMethodString) || !request.Get(kMethodString).is_string())
  {
    setError(result, kInvalidMethodError);
    instance_->PostMessage(result);
    return;
  }
  std::string method = request.Get(kMethodString).AsString();

  if (!request.HasKey(kParamsString) || !request.Get(kParamsString).is_array())
  {
    setError(result, kInvalidParamsError);
    instance_->PostMessage(result);
    return;
  }
  pp::VarArray params(request.Get(kParamsString));

  if (method == "Track")
  {
    if (params.GetLength() < 1)
    {
      setError(result, "expected at least one argument");
      instance_->PostMessage(result);
      return;
    }
    if (!params.Get(0).is_dictionary())
    {
      setError(result, "expected dictionary");
      instance_->PostMessage(result);
      return;
    }
    pp::VarDictionary trackRequest(params.Get(0));
    pp::VarDictionary trackResult;

    this->track(trackRequest, trackResult);

    result.Set("result", trackResult);
    result.Set("error", pp::Var::Null());
    instance_->PostMessage(result);
  }
  else
  {
    setError(result, kUnknownMethodError);
    instance_->PostMessage(result);
  }
}

void RPC::track(const pp::VarDictionary &request, pp::VarDictionary &result)
{
  static thread_local Image scratch;

  int32_t width = request.Get("Width").AsInt();
  int32_t height = request.Get("Height").AsInt();
  pp::VarArrayBuffer buf(request.Get("Data"));
  uint8_t *pixels = static_cast<uint8_t *>(buf.Map());

  Image img = {pixels, width, height};

  if (scratch.Data == NULL)
  {
    scratch.Data = new uint8_t[width * height * 4];
    scratch.Width = width;
    scratch.Height = height;
  }
  else if (scratch.Width != width || scratch.Height != height)
  {
    delete[] scratch.Data;
    scratch.Data = new uint8_t[width * height * 4];
    scratch.Width = width;
    scratch.Height = height;
  }

  // Look for balls
  for (int i = 0; i < width * height * 4; i++)
  {
    scratch.Data[i] = pixels[i];
  }
  MaskGreenish(scratch);

  for (int i = 0; i < width * height * 4; i++)
  {
    img.Data[i] = scratch.Data[i];
  }

  vector<Rect> blobs(3);
  int blobsFound = FindLargestBlobs(scratch, blobs);
  pp::VarArray balls;
  balls.SetLength(blobsFound);
  for (int i = 0; i < blobsFound; i++)
  {
    Rect r = blobs[i];
    pp::VarDictionary d;
    d.Set("X1", r.x1);
    d.Set("X2", r.x2);
    d.Set("Y1", r.y1);
    d.Set("Y2", r.y2);
    balls.Set(i, d);
  }
  result.Set("Balls", balls);

  // Look for faces / hands
  /*
  for (int i=0; i<width*height*4; i++) {
    scratch.Data[i] = img.Data[i];
  }
  MaskSkin(scratch);
  for (int i=0; i<width*height*4; i++) {
    img.Data[i] = scratch.Data[i];
  }
  vector<Rect> faces(3);
  int facesFound = FindLargestBlobs(this->scratch, faces);
  for (int i=0; i<facesFound; i++) {
    Rect r = faces[i];
    for (int x=r.x1; x<r.x2; x++) {
      int y=r.y1+(r.y2-r.y1)/2;
      int o=(y*width+x)*4;
      img.Data[o+0] = 0x00;
      img.Data[o+1] = 0x00;
      img.Data[o+2] = 0xFF;
    }
    for (int y=r.y1; y<r.y2; y++) {
      int x=r.x1+(r.x2-r.x1)/2;
      int o=(y*width+x)*4;
      img.Data[o+0] = 0x00;
      img.Data[o+1] = 0x00;
      img.Data[o+2] = 0xFF;
    }
  }
  */
}
