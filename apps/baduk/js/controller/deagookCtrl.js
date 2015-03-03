/**
 * Created by W.Y.Park on 2015-03-02.
 */

'use strict';

define([], function() {
    function deagookCtrl($scope) {
        $scope.showCircles = true;
        $scope.toggleCircleBtnClass = ['btn', 'btn-xs', 'btn-info'];
        $scope.showSquares = true;
        $scope.toggleSquaresBtnClass = ['btn', 'btn-xs', 'btn-info'];
        $scope.currentDolColor = "black";
        $scope.lines = [];
        $scope.dotCircles = [];
        $scope.panCircles = [];
        $scope.circles = [];
        $scope.squares = [];
        $scope.width = 2000;
        $scope.height = 2000;
        $scope.dx = $scope.width / 20;
        $scope.dy = $scope.height / 20;
        $scope.startX = $scope.dx;
        $scope.startY = $scope.dy;
        $scope.endX = $scope.width - $scope.dx;
        $scope.endY = $scope.height - $scope.dy;
        $scope.panRenderer = function(el, data) {
            var l = el.selectAll('line').data($scope.lines);
            l.enter()
                .append('line')
                .attr("x1", function(d) { return d.x1; })
                .attr("y1", function(d) { return d.y1; })
                .attr("x2", function(d) { return d.x2; })
                .attr("y2", function(d) { return d.y2; });
            var c = el.selectAll('circle.dotCircle').data($scope.dotCircles);
            c.enter()
                .append("circle")
                .attr('cx', $scope.width / 2)
                .attr('cy', $scope.height / 2)
                .attr('opacity', function(d) { return d.opacity; })
                .attr('class', 'dotCircle')
                .style('fill', function(d) { return d.fill; })
                .transition()
                .duration(1000)
                .attr('cx', function(d) { return d.cx; })
                .attr('cy', function(d) { return d.cy; })
                .attr('r', function(d) { return d.r;});
            var d = el.selectAll('circle.panCircle').data($scope.panCircles);
            d.enter()
                .append('circle')
                .on("click", $scope.addCircles)
                .attr('cx', $scope.width / 2)
                .attr('cy', $scope.height / 2)
                .attr('opacity', 1)
                .attr('class', 'panCircle')
                .style('fill', function(d) { return d.fill; })
                .transition()
                .duration(2000)
                .attr('opacity', function(d) { return d.opacity; })
                .attr('cx', function(d) { return d.cx; })
                .attr('cy', function(d) { return d.cy; })
                .attr('r', function(d) { return d.r;});
        };
        $scope.addLines = function() {
            d3.range($scope.startX, $scope.endX + 1, $scope.dx).forEach(function(d) {
                $scope.lines.push({x1: d, y1: $scope.startY, x2: d, y2: $scope.endY});
            });
            d3.range($scope.startY, $scope.endY + 1, $scope.dy).forEach(function(d) {
                $scope.lines.push({x1: $scope.startX, y1: d, x2: $scope.endX, y2: d});
            });
        };
        $scope.addDotCircles = function() {
            var dotArr = [
                {x:4, y:4}, {x:4, y:10}, {x:4, y:16},
                {x:10, y:4}, {x:10, y:10}, {x:10, y:16},
                {x:16, y:4}, {x:16, y:10}, {x:16, y:16}
            ];
            dotArr.forEach(function(d) {
                $scope.dotCircles.push({cx: $scope.dx * d.x, cy: $scope.dy * d.y, r: 15, fill: "black", opacity: 1});
            })
        };
        $scope.addPanCircles = function() {
            var r = Math.min($scope.dx, $scope.dy) / 2 - 2;
            for(var x = 1; x < 20; x++) {
                for(var y = 1; y < 20; y++) {
                    $scope.panCircles.push({cx: x *  $scope.dx, cy: y * $scope.dy, r: r, fill: "red", opacity: 0.10});
                }
            }
        };
        $scope.addLines();
        $scope.addDotCircles();
        $scope.addPanCircles();
        $scope.giboRenderer = function(el, data) {
            var d = el.selectAll('circle').data($scope.circles);
            d.enter()
                .append('circle')
                .attr('cx', $scope.width / 2)
                .attr('cy', $scope.height / 2)
                .attr('opacity', 0)
                .style('fill', function(d) { return d.fill; })
                .transition()
                .duration(100)
                .attr('opacity', function(d) { return d.opacity; })
                .attr('cx', function(d) { return d.cx; })
                .attr('cy', function(d) { return d.cy; })
                .attr('r', function(d) { return d.r;});
            d.exit()
                .transition()
                .duration(1000)
                .attr('cx', $scope.width / 2)
                .attr('cy', $scope.height / 2)
                .attr('r', 0)
                .remove();
            var t = el.selectAll("text").data($scope.circles);
            t.enter()
                .append('text')
                .text(function (d, i) {return i + 1;})
                .attr({"dx": function(d) {return d.cx;}, "dy": function(d) {return d.cy + 5;}, "text-anchor": "middle"})
                .style({"fill": function(d) {return 'black' === d.fill ? 'white' : 'black';}, "font-size": "12px", "font-weight": "bold"});
            t.exit()
                .remove();
        };
        $scope.addCircles = function() {
            var data = d3.select(this).data()[0];
            $scope.circles.push({cx: data.cx, cy: data.cy, r: data.r, fill: $scope.currentDolColor, opacity: 1});
            $scope.currentDolColor = "black" == $scope.currentDolColor ? "white" : "black";
            $scope.$apply();
        };
        $scope.addCirclesRandom = function() {
            var r = Math.min($scope.dx, $scope.dy) / 2 - 2;
            for (var i = 0; i < 50; i++) {
                var x = Math.round(Math.random() * 18) + 1;
                var y = Math.round(Math.random() * 18) + 1;
                $scope.circles.push({cx: x *  $scope.dx, cy: y * $scope.dy, r: r, fill: $scope.currentDolColor, opacity: 1});
                $scope.currentDolColor = "black" == $scope.currentDolColor ? "white" : "black";
            }
        };
        //$scope.addCircles();
        $scope.updateCircle = function() {
            var data = d3.select(this).data()[0];
            if ("green" == data.fill) {
                data.fill = $scope.currentDolColor;
                data.opacity = 1;
                $scope.currentDolColor = "black" == $scope.currentDolColor ? "white" : "black";
            }
            else {
                data.fill = "green";
                data.opacity = 0;
            }
            d3.select(this)
                .attr('opacity', 0)
                .style('fill', data.fill)
                .transition()
                .duration(500)
                .attr('opacity', data.opacity)
                .style('fill', data.fill);
            $scope.$apply();
        };
        $scope.removeCircle = function() {
            for(var i = 0; i < 5; i++) {
                $scope.circles.pop();
            }
        };
        $scope.clearCircles = function() {
            $scope.circles = [];
            $scope.currentDolColor = "black";
        };
        $scope.toggleCircleVisibility = function() {
            $scope.showCircles = !$scope.showCircles;
            if($scope.showCircles) $scope.toggleCircleBtnClass = ['btn', 'btn-xs', 'btn-info'];
            else $scope.toggleCircleBtnClass = ['btn', 'btn-xs', 'btn-danger'];
        };
        $scope.squareRenderer = function(el, data) {
            var d = el.selectAll('rect').data($scope.squares);
            d.enter()
                .append('rect')
                .attr('x', $scope.width / 2)
                .attr('y', $scope.height / 2)
                .attr('width', 0)
                .attr('height', 0)
                .style('fill', function() { return 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')'; })
                .transition()
                .duration(1000)
                .attr('x', function(d) { return d.x - d.size / 2; })
                .attr('y', function(d) { return d.y - d.size / 2; })
                .attr('width', function(d) { return d.size; })
                .attr('height', function(d) { return d.size; });
            d.exit()
                .transition()
                .duration(1000)
                .attr('x', $scope.width / 2)
                .attr('y', $scope.height / 2)
                .attr('width', 0)
                .attr('height', 0)
                .remove();
        };
        $scope.addSquares = function() {
            for (var i = 0; i < 50; i++) {
                var x = Math.round((Math.random() * 18)) + 1;
                var y = Math.round((Math.random() * 18)) + 1;
                var s = Math.min($scope.dx, $scope.dy) * 0.75 ;
                $scope.squares.push({x: x * $scope.dx, y: y * $scope.dy, size: s});
                //$scope.squares.push({x: Math.random() * $scope.width, y: Math.random() * $scope.height, size: Math.random() * 50});
            }
        };
        $scope.clearSquares = function() {
            $scope.squares = [];
        };
        $scope.toggleSquareVisibility = function() {
            $scope.showSquares = !$scope.showSquares;
            if($scope.showSquares) $scope.toggleSquaresBtnClass = ['btn', 'btn-xs', 'btn-info'];
            else $scope.toggleSquaresBtnClass = ['btn', 'btn-xs', 'btn-danger'];
        };
    }

    deagookCtrl.$inject = ['$scope'];

    return deagookCtrl;
});