#ifndef API_H
#define API_H

#include <future>

#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/var.h"
#include "ppapi/cpp/var_array_buffer.h"
#include "ppapi/cpp/var_dictionary.h"
#include "ppapi/cpp/message_loop.h"
#include "ppapi/utility/completion_callback_factory.h"

#include "gfx.hpp"

struct TrackRequest {
  int32_t Width;
  int32_t Height;
  pp::VarArrayBuffer Data;
};

struct TrackResult {
  pp::VarArrayBuffer Data;
};

class RPC {
public:
  RPC(pp::Instance* instance);
  ~RPC();

  void Handle(const pp::VarDictionary& request);

private:
  void track(const pp::VarDictionary& request, pp::VarDictionary& result);
  void handle(int32_t ccb_result, const pp::VarDictionary& request);

  pp::Instance* instance_;
  pp::CompletionCallbackFactory<RPC> factory_;
  std::thread thread_;
  pp::MessageLoop* messageLoop_;
};

#endif
