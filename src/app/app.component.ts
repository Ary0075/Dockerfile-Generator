import { Component } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    dockerFileForm = this.fb.group({
        from: [''],
        maintainer: [''],
        copy: this.fb.array([]),
        cmd: [''],
        entryPoint: [''],
        workDir: [''],
        run: this.fb.array([]),
        env: this.fb.array([]),
        expose: this.fb.array([]),
        volume: this.fb.array([]),
        onBuild: this.fb.array([]),
        user: [''],
        label: this.fb.array([]),
        arg: this.fb.array([]),
    });

    constructor(private fb : FormBuilder, private cbs: ClipboardService, private message: NzMessageService) { }

    get copy() {
        return this.dockerFileForm.get('copy') as FormArray;
    }
    addCopy() {
        this.copy.push(this.fb.group({
            localPath:[''],
            containerPath:['']
        }));
    }
    removeCopy(index: number) {
        this.copy.removeAt(index);
    }

    get run() {
        return this.dockerFileForm.get('run') as FormArray;
    }
    addRun() {
        this.run.push(this.fb.control(''));
    }
    removeRun(index: number) {
        this.run.removeAt(index);
    }

    get env() {
        return this.dockerFileForm.get('env') as FormArray;
    }
    addEnv() {
        this.env.push(this.fb.group({
            key:[''],
            value:['']
        }));
    }
    removeEnv(index: number) {
        this.env.removeAt(index);
    }

    get expose() {
        return this.dockerFileForm.get('expose') as FormArray;
    }
    addExpose() {
        this.expose.push(this.fb.control(''));
    }
    removeExpose(index: number) {
        this.expose.removeAt(index);
    }

    get volume() {
        return this.dockerFileForm.get('volume') as FormArray;
    }
    addVolume() {
        this.volume.push(this.fb.control(''));
    }
    removeVolume(index: number) {
        this.volume.removeAt(index);
    }

    get onBuild() {
        return this.dockerFileForm.get('onBuild') as FormArray;
    }
    addOnBuild() {
        this.onBuild.push(this.fb.control(''));
    }
    removeOnBuild(index: number) {
        this.onBuild.removeAt(index);
    }

    get label() {
        return this.dockerFileForm.get('label') as FormArray;
    }
    addLabel() {
        this.label.push(this.fb.group({
            key:[''],
            value:['']
        }));
    }
    removeLabel(index: number) {
        this.label.removeAt(index);
    }

    get arg() {
        return this.dockerFileForm.get('arg') as FormArray;
    }
    addArg() {
        this.arg.push(this.fb.group({
            key:[''],
            value:['']
        }));
    }
    removeArg(index: number) {
        this.arg.removeAt(index);
    }

    previewContent : string;
    copyType : string = 'copy';

    preview() {
        if (!(this.dockerFileForm.get('from').value || '')) {
            this.message.create('error', `请填写基础镜像`);
            return;
        }

        this.previewContent = 'FROM ' + this.dockerFileForm.get('from').value + '\n';

        var maintainer : string = this.dockerFileForm.get('maintainer').value;
        if (maintainer || '') {
            this.previewContent += 'MAINTAINER ' + maintainer + '\n';
        }

        if (this.copy.length > 0) {
            for (var i = 0; i < this.copy.length; i++) {
                if (!(this.copy.at(i).get('localPath').value || '')) {
                    continue;
                }
                if (this.copyType == 'copy') {
                    this.previewContent += 'COPY ';
                } else if (this.copyType == 'add') {
                    this.previewContent += 'ADD ';
                }
                this.previewContent += this.copy.at(i).get('localPath').value + ' '
                    + this.copy.at(i).get('containerPath').value + '\n';
            }
        }

        var cmd : string = this.dockerFileForm.get('cmd').value;
        if (cmd || '') {
            var cmdArray : string[] = cmd.split(' ');
            var cmdStr : string = '[';
            for (let part of cmdArray) {
                cmdStr += '"' + part + '", ';
            }
            cmdStr = cmdStr.slice(0, cmdStr.length - 2);
            cmdStr += ']';
            this.previewContent += 'CMD ' + cmdStr + '\n';
        }

        var entryPoint : string = this.dockerFileForm.get('entryPoint').value;
        var entryPointArray : string[] = entryPoint.split(' ');
        var entryPointStr : string = '[';
        if (entryPoint || '') {
            for (let part of entryPointArray) {
                entryPointStr += '"' + part + '", ';
            }
            entryPointStr = entryPointStr.slice(0, entryPointStr.length - 2);
            entryPointStr += ']';
            this.previewContent += 'ENTRYPOINT ' + entryPointStr + '\n';
        }

        var workDir : string = this.dockerFileForm.get('workDir').value;
        if (workDir || '') {
            this.previewContent += 'WORKDIR ' + workDir + '\n';
        }

        var run : string;
        var runArray : string[];
        var runStr : string;
        if (this.run.length > 0) {
            for (var i = 0; i < this.run.length; i++) {
                run = this.run.at(i).value;
                if (!(run || '')) {
                    continue;
                }
                runArray = run.split(' ');
                runStr = '[';
                for (let part of runArray) {
                    runStr += '"' + part + '", ';
                }
                runStr = runStr.slice(0, runStr.length - 2);
                runStr += ']';
                this.previewContent += 'RUN ' + runStr + '\n';
            }
        }

        if (this.env.length > 0) {
            for (var i = 0; i < this.env.length; i++) {
                if (!(this.env.at(i).get('key').value || '')) {
                    continue;
                }
                this.previewContent += 'ENV ' + this.env.at(i).get('key').value + '='
                    + this.env.at(i).get('value').value + '\n';
            }
        }

        var exposeStr : string = '';
        if (this.expose.length > 0) {
            for (var i = 0; i < this.expose.length; i++) {
                if (!(this.expose.at(i).value || '')) {
                    continue;
                }
                exposeStr += this.expose.at(i).value + ' ';
            }
            exposeStr = exposeStr.slice(0, exposeStr.length - 1);
            this.previewContent += 'EXPOSE ' + exposeStr + '\n';
        }

        var volumeStr : string = '';
        if (this.volume.length > 0) {
            volumeStr = '[';
            for (var i = 0; i < this.volume.length; i++) {
                if (!(this.volume.at(i).value || '')) {
                    continue;
                }
                volumeStr += '"' + this.volume.at(i).value + '", ';
            }
            volumeStr = volumeStr.slice(0, volumeStr.length - 2);
            volumeStr += ']';
            this.previewContent += 'VOLUME ' + volumeStr + '\n';
        }

        if (this.onBuild.length > 0) {
            for (var i = 0; i < this.onBuild.length; i++) {
                if (!(this.onBuild.at(i).value || '')) {
                    continue;
                }
                this.previewContent += 'ONBUILD ' + this.onBuild.at(i).value + '\n';
            }
        }

        var user : string = this.dockerFileForm.get('user').value;
        if (user || '') {
            this.previewContent += 'USER ' + user + '\n';
        }

        var labelStr : string = '';
        if (this.label.length > 0) {
            for (var i = 0; i < this.label.length; i++) {
                if (!(this.label.at(i).get('key').value || '')) {
                    continue;
                }
                labelStr += this.label.at(i).get('key').value + '="' + this.label.at(i).get('value').value + '" ';
            }
            labelStr = labelStr.slice(0, labelStr.length - 1);
            this.previewContent += 'LABEL ' + labelStr + '\n';
        }

        if (this.arg.length > 0) {
            this.previewContent += '\n';
            for (var i = 0; i < this.arg.length; i++) {
                if (!(this.arg.at(i).get('key').value || '')) {
                    continue;
                } else if (this.arg.at(i).get('value').value || '') {
                    this.previewContent += 'ARG ' + this.arg.at(i).get('key').value + '='
                        + this.arg.at(i).get('value').value + '\n';
                } else {
                    this.previewContent += 'ARG ' + this.arg.at(i).get('key').value + '\n';
                }
            }
        }
    }

    copyPreview() {
        this.cbs.copyFromContent(this.previewContent);
        this.message.create('success', `复制成功`);
    }

    download() {
        var blob = new Blob([this.previewContent], {type : 'application/octet-stream'});
        var link = document.createElement('a');
        link.setAttribute('href', window.URL.createObjectURL(blob));
        link.setAttribute('download', 'Dockerfile');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
