class DashboardController < ApplicationController
  def index
    @boards = Board.order(:created_at)
  end
end
