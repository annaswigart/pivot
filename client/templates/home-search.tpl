<div class="row">
  <div ng-if="resultsLoading" ng-include="'client/templates/loading.tpl'"></div>

  <div class="col-xs-8 col-xs-offset-2 cta-search-box" ng-if="!resultsLoading">

    <form class="form-horizontal" onsubmit="this.reset(); return false;" name="homeQuery" role="form">
      <div class="form-group">

        <div class="col-xs-10 col-xs-offset-1">

          <label class="search-label">
            Explore career profiles. Find a better career.
          </label>

          <ul class="opts">
            <li role="button"ng-repeat="cat in searchCategories" ng-class="{optSelected: isSelected(cat)}" ng-click="selectCategory(cat)" ng-attr-id="{{ 'searchLabel-' + cat.name }}" aria-label="{{'select search category: ' + cat.name}}">{{cat.name}}</li>
          </ul>

          <div class="input-group input-group-lg">
            <input type="text" name="text" class="form-control" placeholder="{{selectedCategory.placeholder}}" ng-model="searchQuery"/>
            <span class="input-group-btn">
              <button ng-click="setQuery(searchQuery)" class="btn btn-primary" aria-label="search" ui-sref="results(query)">
                <span class="fa fa-search" aria-hidden="true"></span>
              </button>
            </span>
          </div>

        </div>

      </div>
    </form>

  </div>
</div>