{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "module.cc"],
      "cflags_cc": [
              "-std=c++11",
              "-stdlib=libc++"
            ],
      "libraries": [ "-L../lib/glyph -Wl -lglyph" ]
    }
  ]
}
