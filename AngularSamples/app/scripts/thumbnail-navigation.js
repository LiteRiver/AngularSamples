(function () {
    'use strict';
    angular.module('rv.thumbnail-navigation', ['ngAnimate']).directive('rvThumbNav', ['$window', '$timeout', function ($window, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {                
                'thumbnails': '=',
                'itemsPerPage': '@',
                'gap': '@',
                'select': '&'
            },
            templateUrl: '/app/templates/thumbnail-navigation.html',
            link: function ($scope, $element, $attrs) {
                var content;
                var win = angular.element($window);
                var resizeTimeout;

                angular.forEach($element.children(), function (el) {
                    var found = angular.element(el);
                    if (found.hasClass('content')) {
                        content = found;
                    }
                });

                content.css('position', 'relative');

                $scope.itemsPerPage = parseInt($scope.itemsPerPage, 10);

                if (!$scope.itemsPerPage || $scope.itemsPerPage < 1) {
                    $scope.itemsPerPage = 4;
                }

                $scope.gap = parseInt($scope.gap, 10);

                if (!$scope.gap || $scope.gap < 0) {
                    $scope.gap = 3;
                }

                $scope.totalPages = Math.ceil($scope.thumbnails.length / $scope.itemsPerPage);

                $scope.pageIndex = 0;

                $scope.selectedIndex = 0;

                layout();

                win.on('resize', resize);

                $element.on('$destroy', function () {
                    win.off('resize', resizeCallback);
                });


                $scope.previous = function ($event) {
                    $event.preventDefault();
                    if ($scope.pageIndex > 0) {
                        $scope.pageIndex--;
                    }
                };

                $scope.next = function ($event) {
                    $event.preventDefault();
                    if ($scope.pageIndex < $scope.totalPages - 1) {
                        $scope.pageIndex++;
                    }
                };

                $scope.$watch('pageIndex', function () {
                    var itemsPerPage = parseInt($scope.itemsPerPage, 10);;
                    var start = $scope.pageIndex * itemsPerPage;
                    var end = start + itemsPerPage;

                    $scope.currentPage = $scope.thumbnails.slice(start, end);
                });

                $scope.selectItem = function ($index) {
                    $scope.selectedIndex = $index;
                    $scope.select({index: $scope.pageIndex * $scope.itemsPerPage + $index});
                };

                function layout() {
                    var gap = parseInt($scope.gap, 10);
                    var itemsPerPage = parseInt($scope.itemsPerPage, 10);
                    var contentWidth = content.prop('clientWidth');
                    var itemSize = (contentWidth - (itemsPerPage + 1) * gap) / itemsPerPage;

                    content.css('height', (itemSize + gap * 2) + 'px');

                    $scope.getItemStyle = function ($index) {
                        return {
                            position: 'absolute',
                            width: itemSize + 'px',
                            height: itemSize + 'px',
                            top: gap + 'px',
                            left: ($index * itemSize + ($index + 1) * gap) + 'px'
                        };
                    };
                };

                function resize() {
                    if (resizeTimeout) {
                        $timeout.cancel(resizeTimeout);
                    }

                    $timeout(function () {
                        $scope.$apply(function () {
                            layout();
                        });
                    }, 200);
                }
            }
        };
    }]);
})();