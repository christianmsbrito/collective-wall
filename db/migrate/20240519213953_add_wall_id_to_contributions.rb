class AddWallIdToContributions < ActiveRecord::Migration[7.0]
  def change
    add_reference :contributions, :wall, null: false, foreign_key: true
  end
end
