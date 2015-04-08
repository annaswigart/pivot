<div class="row">
  <div ng-if="resultsLoading" ng-include="'client/templates/loading.tpl'"></div>

  <div class="col-xs-8 col-xs-offset-2 cta-search-box" ng-if="!resultsLoading">
    <form class="form-horizontal" onsubmit="this.reset(); return false;" name="homeQuery" role="form">
      <div class="form-group">
        <label class="search-label col-xs-5 col-xs-offset-1">
          Find careers related to
        </label>
        <div class="col-xs-5">
          <div class="input-group input-group-lg">
            <input type="text" name="text" class="form-control" placeholder="your interests" ng-model="searchQuery"/>
            <span class="input-group-btn">
              <button ng-click="setQuery(searchQuery)" class="btn btn-primary" aria-label="search" ui-sref="results(query)">
                <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>

