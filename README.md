# Dockerfile-Generator

项目由 [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0 创建

运行 `ng serve` 命令启动服务. 默认地址为 `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## 关于Dockerfile

### FROM

语法：
```
FROM <image>
```
或
```
FROM <image>:<tag>
```

- 绝大多数情况下`FROM`是 Dockerfile 的第一个命令，它定义了该Dockerfile使用哪个基础镜像启动构建流程 。`image`可以是任何已存在的镜像。

- `FROM`可以在一个 Dockerfile 中出现多次，以便于创建混合的 images。

- 如果没有指定`tag`，latest 将会被指定为要使用的基础镜像版本。

### MAINTAINER

语法：
```
MAINTAINER <name>
```

- `MAINTAINER`用于声明作者

### COPY/ADD

`COPY`语法：
```
COPY <src> <dest>
```

`ADD`语法：
```
ADD <src> <dest>
```

- 推荐使用`COPY`

- `COPY/ADD`将文件从路径`src`复制添加到容器内部路径`dest`。

- `src`可以为URL，当遇到URL时候，可以通过URL下载文件并且复制到`dest`。

- `ADD`与`COPY`基本没有区别，仅当用户希望复制到`dest`中的压缩文件可以自动解压时才需要使用`ADD`。

### CMD/ENTRYPOINT

`CMD`语法：
```
CMD ["executable","param1","param2"] //本工具根据该语法生成Dockerfile
```
或
```
CMD command param1 param2
```

`ENTRYPOINT`语法：
```
ENTRYPOINT ["executable","param1","param2"] //本工具根据该语法生成Dockerfile
```
或
```
ENTRYPOINT command param1 param2
```

- 推荐使用`CMD`

- `CMD/ENTRYPOINT`用于执行特定的命令，这些命令在用镜像构建容器后被调用。

- 每个Dockerfile中只能存在一个`CMD/ENTRYPOINT`命令，如果指定了多个，那么只有最后一个会生效。

- `ENTRYPOINT`和`CMD`可以结合使用，此时`CMD`命令可以仅保留参数，参数将传递给`ENTRYPOINT`命令。

- `ENTRYPOINT`与`CMD`的区别在于`ENTRYPOINT`中的参数始终会被使用，而`CMD`的额外参数可以在容器启动时动态替换掉。

以下是两个例子：
```
仅使用ENTRYPOINT：
ENTRYPOINT ["/bin/echo", "Hello"]  

Hello           //通过 docker run -it [image] 启动容器时的输出
Hello CloudMan  //通过 docker run -it [image] CloudMan 启动容器时的输出
```
```
使用ENTRYPOINT和CMD：
ENTRYPOINT ["/bin/echo", "Hello"]  
CMD ["world"] 

Hello world     //通过 docker run -it [image] 启动容器时的输出
Hello CloudMan  //通过 docker run -it [image] CloudMan 启动容器时的输出
```

### WORKDIR

语法：
```
WORKDIR <path>
```

- `WORKDIR`命令用于为后续的`RUN` `CMD` `ENTRYPOINT`命令配置工作目录。

- 一个Dockerfile可以使用多个`WORKDIR`命令，如果后续命令的参数是相对路径，则会基于之前命令指定的路径。

### RUN

语法：
```
RUN ["executable","param1","param2"] //本工具根据该语法生成Dockerfile
```
或
```
RUN command param1 param2
```

- `RUN`的用法类似`CMD`，但是是在镜像构建的过程中执行的，用于对基础镜像进行定制化构建。

### ENV

语法：
```
ENV <key>=<value> //本工具根据该语法生成Dockerfile
```
或
```
ENV <key> <value>
```

- `ENV`命令用于定义镜像的环境变量。

### EXPOSE

语法：
```
EXPOSE <port>
```

- `EXPOSE`命令用于指定端口，使容器内的应用可以通过端口和外界交互。

### VOLUME

语法：
```
VOLUME ["path1","path2"]
```

- `VOLUME`命令用于让容器访问宿主机上的目录。

### ONBUILD

语法：
```
ONBUILD <command>
```

- `ONBUILD`命令是镜像触发器，定义当该镜像被其他镜像作为基础镜像时执行的命令

### USER

语法：
```
USER <name>
```

- `USER`命令用于指定运行时的用户名或UID，后续的`RUN`命令也会使用指定的用户执行。

- Dockerfile默认以root权限启动应用程序，为了安全考虑，除非必须使用root权限，否则推荐使用`USER`命令指定运行用户。

- 要临时获取管理权限可以使用`gosu`，而不推荐`sudo`。

### LABEL

语法：
```
LABEL <key1>=<value1> <key2>=<value2>
```

- `LABEL`命令用于添加元数据到镜像中。

- 一个Dockerfile可以使用多个`LABEL`命令，每一个`LABEL`指令会生成一个新的镜像层。
如果需要指定多个labels，推荐将所有的labels合并到同一个`LABEL`命令中。
如果你使用多个`LABEL`命令，将导致构建出的镜像效率低下。

### ARG

语法：
```
ARG <name>
```
或
```
ARG <name>=<value>
```

- `ARG`命令用于定义构建时需要的参数，是唯一一个可用于`FROM`前的命令。

Docker自带的如下`ARG`参数，可以在其他指令中直接引用:
```
HTTP_PROXY
http_proxy
HTTPS_PROXY
https_proxy
FTP_PROXY
ftp_proxy
NO_PROXY
no_proxy
```
