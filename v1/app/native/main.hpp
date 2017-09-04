#ifndef MAIN_H
#define MAIN_H

#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/var.h"
#include "ppapi/cpp/var_array_buffer.h"
#include "ppapi/cpp/var_dictionary.h"
#include "ppapi/cpp/image_data.h"
#include "ppapi/cpp/graphics_2d.h"
#include "ppapi/utility/completion_callback_factory.h"

#include "gfx.hpp"
#include "disjoint_set.hpp"
#include "rpc.hpp"

#include <vector>
using namespace std;

class MainInstance : public pp::Instance {
  pp::CompletionCallbackFactory<MainInstance> callback_factory_;

public:
  explicit MainInstance(PP_Instance instance) : pp::Instance(instance), callback_factory_(this) {
    rpc_ = new RPC(this);
  }
  virtual ~MainInstance() {
    delete rpc_;
  }

  virtual bool Init(uint32_t argc, const char* argn[], const char* argv[]) {
    return true;
  }

  void OnFlush(int32_t result) {}
  virtual void HandleMessage(const pp::Var& var_message);
private:
  RPC* rpc_;
};

class MainModule : public pp::Module {
public:
  MainModule() : pp::Module() {}
  virtual ~MainModule() {}

  virtual pp::Instance* CreateInstance(PP_Instance instance) {
    return new MainInstance(instance);
  }
};

namespace pp {
  Module* CreateModule() {
    return new MainModule();
  }
}

#endif
