#include "main.hpp"

void MainInstance::HandleMessage(const pp::Var& var_message) {
  if (var_message.is_dictionary()) {
    pp::VarDictionary var_dictionary_message(var_message);
    rpc_->Handle(var_dictionary_message);
  }  
}
