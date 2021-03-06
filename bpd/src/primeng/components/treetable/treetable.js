"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var shared_1 = require("../common/shared");
var shared_2 = require("../common/shared");
var UITreeRow = (function () {
    function UITreeRow(treeTable) {
        this.treeTable = treeTable;
        this.level = 0;
        this.labelExpand = "Expand";
        this.labelCollapse = "Collapse";
    }
    UITreeRow.prototype.ngOnInit = function () {
        this.node.parent = this.parentNode;
    };
    UITreeRow.prototype.toggle = function (event) {
        if (this.node.expanded)
            this.treeTable.onNodeCollapse.emit({ originalEvent: event, node: this.node });
        else
            this.treeTable.onNodeExpand.emit({ originalEvent: event, node: this.node });
        this.node.expanded = !this.node.expanded;
        event.preventDefault();
    };
    UITreeRow.prototype.isLeaf = function () {
        return this.node.leaf == false ? false : !(this.node.children && this.node.children.length);
    };
    UITreeRow.prototype.isSelected = function () {
        return this.treeTable.isSelected(this.node);
    };
    UITreeRow.prototype.onRowClick = function (event) {
        this.treeTable.onRowClick(event, this.node);
    };
    UITreeRow.prototype.onRowTouchEnd = function () {
        this.treeTable.onRowTouchEnd();
    };
    UITreeRow.prototype.resolveFieldData = function (data, field) {
        if (data && field) {
            if (field.indexOf('.') == -1) {
                return data[field];
            }
            else {
                var fields = field.split('.');
                var value = data;
                for (var i = 0, len = fields.length; i < len; ++i) {
                    value = value[fields[i]];
                }
                return value;
            }
        }
        else {
            return null;
        }
    };
    return UITreeRow;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], UITreeRow.prototype, "node", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], UITreeRow.prototype, "parentNode", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], UITreeRow.prototype, "level", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], UITreeRow.prototype, "labelExpand", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], UITreeRow.prototype, "labelCollapse", void 0);
UITreeRow = __decorate([
    core_1.Component({
        selector: '[pTreeRow]',
        template: "\n        <div class=\"ui-treetable-row\" [ngClass]=\"{'ui-state-highlight':isSelected(),'ui-treetable-row-selectable':treeTable.selectionMode}\">\n            <td *ngFor=\"let col of treeTable.columns; let i=index\" [ngStyle]=\"col.style\" [class]=\"col.styleClass\" (click)=\"onRowClick($event,node)\" (touchend)=\"onRowTouchEnd()\">\n                <a href=\"#\" *ngIf=\"i==0\" class=\"ui-treetable-toggler fa fa-fw ui-c\" [ngClass]=\"{'fa-caret-down':node.expanded,'fa-caret-right':!node.expanded}\"\n                    [ngStyle]=\"{'margin-left':level*16 + 'px','visibility': isLeaf() ? 'hidden' : 'visible'}\"\n                    (click)=\"toggle($event)\"\n                    [title]=\"node.expanded ? labelCollapse : labelExpand\">\n                </a>\n                <div class=\"ui-chkbox ui-treetable-checkbox\" *ngIf=\"treeTable.selectionMode == 'checkbox' && i==0\"><div class=\"ui-chkbox-box ui-widget ui-corner-all ui-state-default\" (click)=\"onRowClick($event)\">\n                    <span class=\"ui-chkbox-icon ui-c fa\" \n                        [ngClass]=\"{'fa-check':isSelected(),'fa-minus':node.partialSelected}\"></span></div></div\n                ><span *ngIf=\"!col.template\">{{resolveFieldData(node.data,col.field)}}</span>\n                <p-columnBodyTemplateLoader [column]=\"col\" [rowData]=\"node\" *ngIf=\"col.template\"></p-columnBodyTemplateLoader>\n            </td>\n        </div>\n        <div *ngIf=\"node.children && node.expanded\" class=\"ui-treetable-row\" style=\"display:table-row\">\n            <td [attr.colspan]=\"treeTable.columns.length\" class=\"ui-treetable-child-table-container\">\n                <table>\n                    <tbody pTreeRow *ngFor=\"let childNode of node.children\" [node]=\"childNode\" [level]=\"level+1\" [labelExpand]=\"labelExpand\" [labelCollapse]=\"labelCollapse\" [parentNode]=\"node\"></tbody>\n                </table>\n            </td>\n        </div>\n    "
    }),
    __param(0, core_1.Inject(core_1.forwardRef(function () { return TreeTable; }))),
    __metadata("design:paramtypes", [TreeTable])
], UITreeRow);
exports.UITreeRow = UITreeRow;
var TreeTable = (function () {
    function TreeTable() {
        this.selectionChange = new core_1.EventEmitter();
        this.onNodeSelect = new core_1.EventEmitter();
        this.onNodeUnselect = new core_1.EventEmitter();
        this.onNodeExpand = new core_1.EventEmitter();
        this.onNodeCollapse = new core_1.EventEmitter();
        this.labelExpand = "Expand";
        this.labelCollapse = "Collapse";
        this.metaKeySelection = true;
    }
    TreeTable.prototype.onRowClick = function (event, node) {
        // 阻止事件冒泡
        var e = event || window.event;
        if (e.stopPropagation) {
            e.stopPropagation(); //W3C 
        } else {
            e.cancelBubble = true; //IE 
        }
        var eventTarget = event.target;
        if (eventTarget.className.indexOf('ui-chkbox') === -1 && this.isCheckboxSelectionMode()) {
            return;
        }
        if (eventTarget.className && eventTarget.className.indexOf('ui-treetable-toggler') === 0) {
            return;
        }
        else {
            var metaSelection = this.rowTouched ? false : this.metaKeySelection;
            var index = this.findIndexInSelection(node);
            var selected = (index >= 0);
            if (this.isCheckboxSelectionMode()) {
                if (selected) {
                    this.propagateSelectionDown(node, false);
                    if (node.parent) {
                        this.propagateSelectionUp(node.parent, false);
                    }
                    this.selectionChange.emit(this.selection);
                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                }
                else {
                    this.propagateSelectionDown(node, true);
                    if (node.parent) {
                        this.propagateSelectionUp(node.parent, true);
                    }
                    this.selectionChange.emit(this.selection);
                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            }
            else {
                if (metaSelection) {
                    var metaKey = (event.metaKey || event.ctrlKey);
                    if (selected && metaKey) {
                        if (this.isSingleSelectionMode()) {
                            this.selectionChange.emit(null);
                        }
                        else {
                            this.selection.splice(index, 1);
                            this.selectionChange.emit(this.selection);
                        }
                        this.onNodeUnselect.emit({ originalEvent: event, node: node });
                    }
                    else {
                        if (this.isSingleSelectionMode()) {
                            this.selectionChange.emit(node);
                        }
                        else if (this.isMultipleSelectionMode()) {
                            this.selection = (!metaKey) ? [] : this.selection || [];
                            this.selection.push(node);
                            this.selectionChange.emit(this.selection);
                        }
                        this.onNodeSelect.emit({ originalEvent: event, node: node });
                    }
                }
                else {
                    if (this.isSingleSelectionMode()) {
                        if (selected) {
                            this.selection = null;
                            this.onNodeUnselect.emit({ originalEvent: event, node: node });
                        }
                        else {
                            this.selection = node;
                            this.onNodeSelect.emit({ originalEvent: event, node: node });
                        }
                    }
                    else {
                        if (selected) {
                            this.selection.splice(index, 1);
                            this.onNodeUnselect.emit({ originalEvent: event, node: node });
                        }
                        else {
                            this.selection = this.selection || [];
                            this.selection.push(node);
                            this.onNodeSelect.emit({ originalEvent: event, node: node });
                        }
                    }
                    this.selectionChange.emit(this.selection);
                }
            }
        }
        this.rowTouched = false;
    };
    TreeTable.prototype.onRowTouchEnd = function () {
        this.rowTouched = true;
    };
    TreeTable.prototype.findIndexInSelection = function (node) {
        var index = -1;
        if (this.selectionMode && this.selection) {
            if (this.isSingleSelectionMode()) {
                index = (this.selection == node) ? 0 : -1;
            }
            else {
                for (var i = 0; i < this.selection.length; i++) {
                    if (this.selection[i] == node) {
                        index = i;
                        break;
                    }
                }
            }
        }
        return index;
    };
    TreeTable.prototype.propagateSelectionUp = function (node, select) {
        if (node.children && node.children.length) {
            var selectedCount = 0;
            var childPartialSelected = false;
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                if (this.isSelected(child)) {
                    selectedCount++;
                }
                // else if (child.partialSelected) {
                //     childPartialSelected = true;
                // }
            }
            if (select) {
                this.selection.push(node);
            }
            if (select && selectedCount == node.children.length) {
                this.selection = this.selection || [];
                node.partialSelected = false;
            }
            else {
                if (!select && selectedCount == 0) {
                    var index = this.findIndexInSelection(node);
                    if (index >= 0) {
                        this.selection.splice(index, 1);
                    }
                }
                // if (childPartialSelected || selectedCount > 0 && selectedCount != node.children.length)
                //     node.partialSelected = true;
                // else
                //     node.partialSelected = false;
            }
        }
        var parent = node.parent;
        if (parent) {
            this.propagateSelectionUp(parent, select);
        }
    };
    TreeTable.prototype.propagateSelectionDown = function (node, select) {
        var index = this.findIndexInSelection(node);
        if (select && index == -1) {
            this.selection = this.selection || [];
            this.selection.push(node);
        }
        else if (!select && index > -1) {
            this.selection.splice(index, 1);
        }
        // node.partialSelected = false;
        if (node.children && node.children.length) {
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                this.propagateSelectionDown(child, select);
            }
        }
    };
    TreeTable.prototype.isSelected = function (node) {
        return this.findIndexInSelection(node) != -1;
    };
    TreeTable.prototype.isSingleSelectionMode = function () {
        return this.selectionMode && this.selectionMode == 'single';
    };
    TreeTable.prototype.isMultipleSelectionMode = function () {
        return this.selectionMode && this.selectionMode == 'multiple';
    };
    TreeTable.prototype.isCheckboxSelectionMode = function () {
        return this.selectionMode && this.selectionMode == 'checkbox';
    };
    TreeTable.prototype.hasFooter = function () {
        if (this.columns) {
            var columnsArr = this.columns.toArray();
            for (var i = 0; i < columnsArr.length; i++) {
                if (columnsArr[i].footer) {
                    return true;
                }
            }
        }
        return false;
    };
    return TreeTable;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], TreeTable.prototype, "value", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TreeTable.prototype, "selectionMode", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TreeTable.prototype, "selection", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], TreeTable.prototype, "selectionChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], TreeTable.prototype, "onNodeSelect", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], TreeTable.prototype, "onNodeUnselect", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], TreeTable.prototype, "onNodeExpand", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], TreeTable.prototype, "onNodeCollapse", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TreeTable.prototype, "style", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TreeTable.prototype, "styleClass", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TreeTable.prototype, "labelExpand", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TreeTable.prototype, "labelCollapse", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TreeTable.prototype, "metaKeySelection", void 0);
__decorate([
    core_1.ContentChild(shared_1.Header),
    __metadata("design:type", shared_1.Header)
], TreeTable.prototype, "header", void 0);
__decorate([
    core_1.ContentChild(shared_1.Footer),
    __metadata("design:type", shared_1.Footer)
], TreeTable.prototype, "footer", void 0);
__decorate([
    core_1.ContentChildren(shared_1.Column),
    __metadata("design:type", core_1.QueryList)
], TreeTable.prototype, "columns", void 0);
TreeTable = __decorate([
    core_1.Component({
        selector: 'p-treeTable',
        template: "\n        <div [ngClass]=\"'ui-treetable ui-widget'\" [ngStyle]=\"style\" [class]=\"styleClass\">\n            <div class=\"ui-treetable-header ui-widget-header\" *ngIf=\"header\">\n                <ng-content select=\"p-header\"></ng-content>\n            </div>\n            <div class=\"ui-treetable-tablewrapper\">\n                <table class=\"ui-widget-content\">\n                    <thead>\n                        <tr class=\"ui-state-default\">\n                            <th #headerCell *ngFor=\"let col of columns\" [ngStyle]=\"col.style\" [class]=\"col.styleClass\" \n                                [ngClass]=\"'ui-state-default ui-unselectable-text'\">\n                                <span class=\"ui-column-title\" *ngIf=\"!col.headerTemplate\">{{col.header}}</span>\n                                <span class=\"ui-column-title\" *ngIf=\"col.headerTemplate\">\n                                    <p-columnHeaderTemplateLoader [column]=\"col\"></p-columnHeaderTemplateLoader>\n                                </span>\n                            </th>\n                        </tr>\n                    </thead>\n                    <tfoot *ngIf=\"hasFooter()\">\n                        <tr>\n                            <td *ngFor=\"let col of columns\" [ngStyle]=\"col.style\" [class]=\"col.styleClass\" [ngClass]=\"{'ui-state-default':true}\">\n                                <span class=\"ui-column-footer\" *ngIf=\"!col.footerTemplate\">{{col.footer}}</span>\n                                <span class=\"ui-column-footer\" *ngIf=\"col.footerTemplate\">\n                                    <p-columnFooterTemplateLoader [column]=\"col\"></p-columnFooterTemplateLoader>\n                                </span>\n                            </td>\n                        </tr>\n                    </tfoot>\n                    <tbody pTreeRow *ngFor=\"let node of value\" [node]=\"node\" [level]=\"0\" [labelExpand]=\"labelExpand\" [labelCollapse]=\"labelCollapse\"></tbody>\n                </table>\n            </div>\n            <div class=\"ui-treetable-footer ui-widget-header\" *ngIf=\"footer\">\n                <ng-content select=\"p-footer\"></ng-content>\n            </div>\n        </div>\n    "
    })
], TreeTable);
exports.TreeTable = TreeTable;
var TreeTableModule = (function () {
    function TreeTableModule() {
    }
    return TreeTableModule;
}());
TreeTableModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, shared_2.SharedModule],
        exports: [TreeTable, shared_2.SharedModule],
        declarations: [TreeTable, UITreeRow]
    })
], TreeTableModule);
exports.TreeTableModule = TreeTableModule;
//# sourceMappingURL=treetable.js.map