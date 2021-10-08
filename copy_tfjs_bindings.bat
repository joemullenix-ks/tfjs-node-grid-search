echo OFF

REM TJFS keeps botching this so that it takes extra steps to friggin use.
REM These feels like it's going to break down the road. The folder is napi-v7,
REM but TFJS is on version 8, so right away it's fragile.
REM Keep an eye on this action, which should fail on 'unknown folder' if/when.

copy .\node_modules\@tensorflow\tfjs-node\deps\lib\tensorflow.dll .\node_modules\@tensorflow\tfjs-node\lib\napi-v7\
            ...what about this sister file? "tensorflow.lib"
