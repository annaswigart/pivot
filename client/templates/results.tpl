<div ng-if="" ng-include="'client/templates/loading.tpl'"></div>

<div class="row">
  <div class="col-md-3">
      <div class="sidebar">
          
      </div>

  </div>

  <div class="col-md-9 chart-area">
    <div class="row">
      <div class="col-md-6 chart-container" ng-repeat="job in jobs" id="{{job._id}}">
        <div class="result-box">
          {{job.title}}
        </div>
      </div>

    </div>
  </div>


</div>
