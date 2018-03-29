#include <node.h>
#include <node_buffer.h>

#include "lib/glyph/glyph.h"

#include <fcntl.h>
#ifdef __unix__
#include <unistd.h>
#endif
#if defined(WIN32) || defined(_WIN32) || defined(__WIN32) && !defined(__CYGWIN__)
#define WINDOWS 1
#include <Windows.h>
#endif
namespace GLYPH {

using namespace v8;

void GenKey(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  unsigned char* seed = (unsigned char*)node::Buffer::Data(args[0]);
  v8::Local<v8::Value> sk = node::Buffer::New(isolate, glyph_private_keysize()).ToLocalChecked();
  v8::Local<v8::Value> pk = node::Buffer::New(isolate, glyph_public_keysize()).ToLocalChecked();

  glyph_gen_keypair((unsigned char*)node::Buffer::Data(sk), (unsigned char*)node::Buffer::Data(pk), seed);

  v8::Local<Object> obj = v8::Object::New(isolate);
  obj->Set(v8::String::NewFromUtf8(isolate, "private"), sk);
  obj->Set(v8::String::NewFromUtf8(isolate, "public"), pk);
  args.GetReturnValue().Set(obj);
}

void signData(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  size_t messageLen = node::Buffer::Length(args[0]);
  unsigned char* message = (unsigned char*)node::Buffer::Data(args[0]);

  unsigned char* sk = (unsigned char*)node::Buffer::Data(args[1]);

  v8::Local<v8::Value> signature = node::Buffer::New(isolate, glyph_signature_size()).ToLocalChecked();
  int ret = glyph_sign((unsigned char*)node::Buffer::Data(signature), message, messageLen, sk);

  v8::Local<v8::Object> output = v8::Object::New(isolate);
  output->Set(String::NewFromUtf8(isolate, "buffer"), signature);
  output->Set(String::NewFromUtf8(isolate, "status"), v8::Boolean::New(isolate, ret == 1));
  args.GetReturnValue().Set(output);

}

void verifyData(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  unsigned char* sig = (unsigned char*)node::Buffer::Data(args[0]);

  size_t messageLen = node::Buffer::Length(args[1]);
  unsigned char* message = (unsigned char*)node::Buffer::Data(args[1]);

  unsigned char* pubkey = (unsigned char*)node::Buffer::Data(args[2]);

  int ret = glyph_verify(message, messageLen, sig, pubkey);
  bool ok = ret == 1;

  args.GetReturnValue().Set(v8::Boolean::New(isolate, ok));
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "genKey", GenKey);
  NODE_SET_METHOD(exports, "sign", signData);
  NODE_SET_METHOD(exports, "verify", verifyData);
}

NODE_MODULE(addon, init)
}
