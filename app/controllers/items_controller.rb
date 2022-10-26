class ItemsController < ApplicationController
  # before_action :authenticate_user!

  protect_from_forgery with: :null_session, only: :destroy

  def new
    @item = list.items.new
  end


  def create
    @item = list.items.new(item_params)

    if @item.save
      redirect_to board_path(list.board)
    else
      render :new
    end
  end

  private

  def list
    @list ||= List.find(params[:list_id])
  end

  def item_params
    params.require(:item).permit(:title, :description)
  end
end
